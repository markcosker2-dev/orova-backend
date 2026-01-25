from flask import Flask, send_from_directory, request, jsonify, Response
from flask_cors import CORS
import os
import requests
from bs4 import BeautifulSoup
import time
import csv
import io
import gspread
from google.oauth2.service_account import Credentials

app = Flask(__name__, static_folder='.')
CORS(app)

# Ensure upload directory exists
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# ===== API ROUTES (MUST BE FIRST) =====

@app.route('/api/submit-lead', methods=['POST'])
def submit_lead():
    data = request.json
    print(f"Received lead: {data}")
    
    try:
        # Google Sheets Setup
        SCOPES = ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive']
        
        SERVICE_ACCOUNT_FILE = None
        
        # 1. Try Environment Variable (Most Robust)
        json_creds = os.environ.get('GOOGLE_CREDENTIALS_JSON')
        if json_creds:
            print("Found credentials in GOOGLE_CREDENTIALS_JSON env var.")
            import json
            import tempfile
            # Write to temp file because Credentials.from_service_account_file needs a file
            # Or use from_service_account_info if we parse it
            try:
                creds_dict = json.loads(json_creds)
                credentials = Credentials.from_service_account_info(creds_dict, scopes=SCOPES)
                SERVICE_ACCOUNT_FILE = "ENV_VAR" # Marker
            except Exception as e:
                print(f"Error parsing GOOGLE_CREDENTIALS_JSON: {e}")

        # 2. If no Env Var, try File Paths
        if not SERVICE_ACCOUNT_FILE:
            possible_paths = [
                'service_account.json',
                '/etc/secrets/service_account.json',
                os.path.join(os.getcwd(), 'service_account.json')
            ]
            
            for path in possible_paths:
                if os.path.exists(path):
                    SERVICE_ACCOUNT_FILE = path
                    print(f"Found service account at: {path}")
                    break
            
            # DEBUG: List directories if file not found
            if not SERVICE_ACCOUNT_FILE:
                print("--- DEBUG: File not found. Listing directories ---")
                print(f"Current Dir ({os.getcwd()}): {os.listdir(os.getcwd())}")
                if os.path.exists('/etc/secrets'):
                    print(f"/etc/secrets: {os.listdir('/etc/secrets')}")
                else:
                    print("/etc/secrets does not exist.")
                print("--------------------------------------------------")

        if SERVICE_ACCOUNT_FILE:
            # If we didn't load from Env Var yet, load from file
            if SERVICE_ACCOUNT_FILE != "ENV_VAR":
                credentials = Credentials.from_service_account_file(
                    SERVICE_ACCOUNT_FILE, scopes=SCOPES)
            
            gc = gspread.authorize(credentials)
            
            # Try to open 'OROVA Leads', create if not exists
            sheet_name = 'OROVA Leads'
            try:
                sh = gc.open(sheet_name)
            except gspread.exceptions.SpreadsheetNotFound:
                # Fallback to lowercase check
                try:
                    sh = gc.open('OROVA leads')
                    print("Found sheet as 'OROVA leads' (lowercase).")
                except:
                    print(f"Sheet '{sheet_name}' not found. Creating it...")
                    sh = gc.create(sheet_name)
                    # Note: This sheet is created by the service account.
                    try:
                        worksheet = sh.get_worksheet(0)
                        worksheet.append_row(["Timestamp", "First Name", "Last Name", "Phone", "Business", "Email", "Area"])
                        print(f"Created new sheet. User must share '{sheet_name}' with {credentials.service_account_email}")
                    except:
                        pass

            worksheet = sh.sheet1
            
            row = [
                data.get('timestamp', ''),
                data.get('firstName', ''),
                data.get('lastName', ''),
                data.get('phone', ''),
                data.get('business', ''),
                data.get('email', ''),
                data.get('area', '')
            ]
            worksheet.append_row(row)
            return jsonify({"success": True, "message": "Lead saved to Google Sheets"})
        else:
             print("Service account file not found in any known location. Lead logged to console only.")
             return jsonify({"success": True, "message": "Lead received (No Sheets config found)"})

    except Exception as e:
        print(f"Error saving to sheet: {e}")
        return jsonify({"success": True, "message": "Lead received (Sheet update failed)"}), 200



@app.route('/api/analyze_url', methods=['POST'])
def analyze_url():
    data = request.json
    url = data.get('url', '')
    
    if not url:
        return jsonify({"error": "No URL provided"}), 400
        
    try:
        # Basic validation
        if not url.startswith('http'):
            url = 'https://' + url
            
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
        
        # Check if it's a social media URL
        is_social = any(platform in url.lower() for platform in ['facebook.com', 'instagram.com', 'linkedin.com', 'twitter.com', 'tiktok.com'])
        
        response = requests.get(url, headers=headers, timeout=10)
        
        if response.status_code == 200:
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Extract Title (Product/Brand Name)
            title = soup.title.string.strip() if soup.title else "Unknown Brand"
            if "|" in title: 
                title = title.split("|")[0].strip()
            elif "-" in title:
                title = title.split("-")[0].strip()
            
            # Extract Description (USP)
            desc_tag = soup.find('meta', attrs={'name': 'description'}) or soup.find('meta', attrs={'property': 'og:description'})
            description = desc_tag['content'].strip() if desc_tag else "Quality services and products."
            
            # Extract Target Audience by analyzing content
            target_audience = detect_target_audience(soup, description, url)
            
            return jsonify({
                "product_name": title[:50],
                "usp": description[:100] + "..." if len(description) > 100 else description,
                "target_audience": target_audience
            })
            
    except Exception as e:
        print(f"Scrape Error: {e}")
        return jsonify({"error": "Could not analyze website"}), 500
        
    return jsonify({"error": "Could not access website"}), 404

def detect_target_audience(soup, description, url):
    """Detect target audience from website content using keyword analysis"""
    # Get all text content
    text_content = soup.get_text().lower() + " " + description.lower() + " " + url.lower()
    
    # Audience detection patterns (keyword -> audience mapping)
    audience_patterns = {
        'Small Business Owners': ['small business', 'startup', 'entrepreneur', 'smb', 'local business', 'business owner'],
        'E-commerce Brands': ['ecommerce', 'e-commerce', 'online store', 'shopify', 'dropship', 'online shop'],
        'Digital Marketers': ['marketing', 'seo', 'social media', 'ads', 'advertising', 'digital marketing'],
        'Gym Owners': ['gym', 'fitness center', 'crossfit', 'personal training', 'fitness studio'],
        'Restaurant Owners': ['restaurant', 'cafe', 'coffee shop', 'dining', 'food service', 'bar'],
        'Real Estate Agents': ['real estate', 'property', 'realtor', 'homes', 'housing'],
        'SaaS Companies': ['saas', 'software', 'platform', 'api', 'cloud', 'subscription'],
        'Healthcare Professionals': ['doctor', 'clinic', 'medical', 'health', 'dentist', 'therapy'],
        'Automotive Businesses': ['car', 'auto', 'vehicle', 'dealership', 'mechanic', 'automotive'],
        'Coaches & Consultants': ['coach', 'consulting', 'consultant', 'mentor', 'advisor']
    }
    
    # Score each audience
    scores = {}
    for audience, keywords in audience_patterns.items():
        scores[audience] = sum(1 for keyword in keywords if keyword in text_content)
    
    # Return audience with highest score, or default
    best_match = max(scores, key=scores.get)
    return best_match if scores[best_match] > 0 else 'Small Business Owners'


@app.route('/api/deep_analyze', methods=['POST'])
def deep_analyze():
    """
    Deep business intelligence extraction using Google Gemini AI (FREE)
    Analyzes entire website to extract comprehensive business data
    """
    import json
    
    data = request.json
    url = data.get('url', '')
    
    if not url:
        return jsonify({"error": "No URL provided"}), 400
    
    try:
        # Check if API key is configured
        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            return jsonify({
                "error": "AI analysis is not configured. Please set GEMINI_API_KEY environment variable.",
                "error_code": "MISSING_API_KEY",
                "help": "Get a free API key from https://aistudio.google.com/app/apikey"
            }), 503
        
        # Step 1: Scrape the website comprehensively
        if not url.startswith('http'):
            url = 'https://' + url
            
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        }
        
        response = requests.get(url, headers=headers, timeout=15)
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Remove non-content elements
        for script in soup(["script", "style", "nav", "footer", "iframe"]):
            script.decompose()
        
        # Extract comprehensive text content
        title = soup.title.string.strip() if soup.title else ""
        
        meta_desc = soup.find('meta', attrs={'name': 'description'})
        meta_desc = meta_desc['content'].strip() if meta_desc else ""
        
        # Get main content text (limit to first 3000 chars)
        body_text = soup.get_text(separator=' ', strip=True)[:3000]
        
        # Get all headings (key value props)
        headings = [h.get_text(strip=True) for h in soup.find_all(['h1', 'h2', 'h3'])]
        headings_text = ' | '.join(headings[:10])
        
        # Check for social proof indicators
        has_testimonials = bool(soup.find_all(string=lambda text: text and any(
            word in text.lower() for word in ['review', 'testimonial', 'customer', 'client']
        )))
        has_pricing = bool(soup.find_all(string=lambda text: text and '$' in str(text)))
        
        # Step 2: Analyze with Gemini
        import google.generativeai as genai
        genai.configure(api_key=api_key)
        
        analysis_prompt = f"""
You are a Meta lead generation ads expert analyzing a business website to create high-converting ad campaigns.

WEBSITE DATA:
URL: {url}
Title: {title}
Meta Description: {meta_desc}
Key Headings: {headings_text}
Content Sample: {body_text[:2000]}

Has Testimonials: {has_testimonials}
Has Pricing Info: {has_pricing}

ANALYSIS REQUIRED:
Analyze this business and provide a JSON response with ONLY the following structure (no markdown, no explanation):

{{
  "business_name": "exact business name",
  "industry": "specific industry (e.g., CrossFit Gym, SaaS Marketing Tool, Dental Practice)",
  "target_audience": "specific avatar (e.g., 'Busy professionals 25-45 who want to lose weight')",
  "main_pain_points": ["pain point 1", "pain point 2", "pain point 3"],
  "unique_value_props": ["unique benefit 1", "unique benefit 2"],
  "current_offer": "what they're selling (e.g., 'Free trial', '30-day challenge', 'Free consultation')",
  "price_point": "approximate pricing tier (Budget/Mid-range/Premium/Enterprise)",
  "social_proof_available": true,
  "competitors_likely": ["competitor 1", "competitor 2"],
  "conversion_goal": "what action they want (Sign up/Book call/Purchase/Download)",
  "brand_voice": "tone (Professional/Casual/Edgy/Inspirational)",
  "key_objections": ["objection 1", "objection 2"],
  "urgency_factors": ["reason to act now 1", "reason to act now 2"]
}}

Be specific and strategic. Base everything on the actual content you see.
"""

        model = genai.GenerativeModel('gemini-2.5-flash')
        response = model.generate_content(analysis_prompt)
        
        # Parse Gemini's response
        analysis_text = response.text.strip()
        
        # Remove markdown code blocks if present
        if analysis_text.startswith('```'):
            analysis_text = analysis_text.split('```')[1]
            if analysis_text.startswith('json'):
                analysis_text = analysis_text[4:]
            analysis_text = analysis_text.rsplit('```', 1)[0]
        
        business_intelligence = json.loads(analysis_text)
        
        print(f"Deep analysis complete for {business_intelligence.get('business_name', 'Unknown')}")
        
        return jsonify({
            "success": True,
            "intelligence": business_intelligence,
            "url_analyzed": url
        })
        
    except json.JSONDecodeError as e:
        print(f"Failed to parse AI response: {e}")
        return jsonify({"error": "AI analysis failed to return valid data"}), 500
        
    except Exception as e:
        print(f"Deep analysis error: {str(e)}")
        return jsonify({"error": "Could not analyze website. Please check URL and try again."}), 500

@app.route('/api/generate', methods=['POST'])
def generate():
    """
    Generate complete AI-powered lead gen campaign
    Uses AI copywriter if business_intelligence provided, otherwise falls back to templates
    """
    try:
        # Check if this is an AI-powered generation (new flow)
        business_intel_str = request.form.get('business_intelligence')
        
        if business_intel_str:
            # NEW: AI-powered generation
            import json
            from ai_copywriter import generate_perfect_lead_gen_ads, validate_landing_page
            
            business_intel = json.loads(business_intel_str)
            location = request.form.get('location', 'Global')
            landing_page_url = request.form.get('landing_page_url', '')
            
            print(f"Generating AI-powered ads for {business_intel.get('business_name', 'Unknown')}")
            
            # Generate AI-powered ads
            campaign_data = generate_perfect_lead_gen_ads(business_intel, location)
            
            # Optionally validate landing page
            if landing_page_url:
                print(f"Validating landing page: {landing_page_url}")
                lp_validation = validate_landing_page(landing_page_url)
                campaign_data['landing_page_analysis'] = lp_validation
            
            return jsonify(campaign_data)
        
        else:
            # FALLBACK: Template-based generation (legacy flow)
            print("Using legacy template-based generation")
            
            # Handle optional file uploads
            uploaded_files = request.files.getlist('media')
            file_names = []
            
            for file in uploaded_files:
                if file.filename:
                    filepath = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
                    file.save(filepath)
                    file_names.append(file.filename)
                    
            # Handle Form Data
            product_name = request.form.get('product_name', 'This Product')
            target_audience = request.form.get('target_audience', 'Everyone')
            usp = request.form.get('usp', 'Quality')
            location = request.form.get('location', 'Global')
            
            # Generate complete campaign strategy (V4)
            from templates import generate_campaign_strategy
            result = generate_campaign_strategy(product_name, target_audience, usp, location)
            
            # If media was uploaded, influence the creative concepts
            if file_names:
                for variation in result['variations']:
                    variation['creative'] += f" (Enhanced with uploaded asset: {file_names[0]})"
            
            return jsonify(result)
        
    except Exception as e:
        print(f"Generation error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": "Failed to generate campaign. Please try again."}), 500


@app.route('/api/export_csv', methods=['POST'])
def export_csv():
    """
    Export campaign data as CSV for Meta Ads Manager import.
    """
    data = request.json
    
    # Create CSV in memory
    output = io.StringIO()
    writer = csv.writer(output)
    
    # CSV Headers (Meta Ads Manager EXACT format)
    writer.writerow([
        'Campaign Name',
        'Campaign Budget',
        'Ad Set Name', 
        'Ad Set Budget',
        'Optimization Goal',
        'Billing Event',
        'Bid Strategy',
        'Ad Name',
        'Text',
        'Title',
        'Description',
        'Website URL',
        'Call To Action',
        'Interests',
        'Age Min',
        'Age Max',
        'Gender'
    ])
    
    # Campaign metadata
    product = data.get('product', 'Product')
    location = data.get('location', 'Global')
    audience = data.get('audience', 'All')
    campaign_name = f"{product} - {location}"
    
    # Write each variation as a row
    variations = data.get('variations', [])
    targeting = data.get('targeting', {})
    
    for i, var in enumerate(variations, 1):
        ad_set_name = f"{campaign_name} - {var.get('angle', 'Angle').split('/')[0].strip()}"
        ad_name = f"Ad {i} - {var.get('angle', 'Creative')}"
        headline = var.get('hook', '')[:27]  # Meta headline limit is 27 chars
        primary_text = var.get('body', '').replace('\n', ' ')[:125]  # Primary text limit
        cta = var.get('cta', 'Learn More')
        creative = var.get('creative', '')
        
        writer.writerow([
            campaign_name,
            '',  # Leave empty - set in Ads Manager
            ad_set_name,
            '',  # Leave empty - set in Ads Manager
            'LEAD_GENERATION',  # Optimization goal
            'IMPRESSIONS',  # Billing event
            'LOWEST_COST_WITHOUT_CAP',  # Bid strategy
            ad_name,
            primary_text,  # Text (Primary Text)
            headline,  # Title (Headline)
            product[:30],  # Description (truncated)
            '',  # Website URL - user adds in Ads Manager
            cta,
            targeting.get('interests', 'Business, Marketing'),  # Interests
            '24',  # Age Min
            '55',  # Age Max
            'All'  # Gender
        ])
    
    # Return CSV as downloadable file
    output.seek(0)
    return Response(
        output.getvalue(),
        mimetype="text/csv",
        headers={"Content-Disposition": f"attachment; filename={product.replace(' ', '_')}_campaign.csv"}
    )

# ===== STATIC ROUTES (MUST BE LAST) =====

@app.route('/')
def home():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    if os.path.exists(path):
        return send_from_directory('.', path)
    return send_from_directory('.', 'index.html')

if __name__ == '__main__':
    print("Starting Personal Adquisition Server (v2)...")
    app.run(port=5002, debug=True)
