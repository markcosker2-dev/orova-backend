# -*- coding: utf-8 -*-
"""
AI Copywriter Module for OROVA
Uses Google Gemini API (FREE TIER) to generate persuasive lead generation ads
"""

import google.generativeai as genai
import os
import json
import logging

logger = logging.getLogger(__name__)

# Initialize Gemini client (with validation)
api_key = os.environ.get("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)
else:
    logger.warning("GEMINI_API_KEY not set - AI features will be unavailable")

def generate_perfect_lead_gen_ads(business_intel, location="Global"):
    """
    Generate 3 complete, persuasive Meta lead gen ad variations
    using deep business intelligence.
    """
    
    # Extract key data
    business = business_intel.get('business_name', 'This Business')
    industry = business_intel.get('industry', 'Business')
    audience = business_intel.get('target_audience', 'Business Owners')
    pain_points = business_intel.get('main_pain_points', [])
    value_props = business_intel.get('unique_value_props', [])
    offer = business_intel.get('current_offer', 'Free Consultation')
    price_tier = business_intel.get('price_point', 'Mid-range')
    voice = business_intel.get('brand_voice', 'Professional')
    objections = business_intel.get('key_objections', [])
    urgency = business_intel.get('urgency_factors', [])
    
    # Currency adaptation
    currency = "$"
    if location and ("bangkok" in location.lower() or "thailand" in location.lower()):
        currency ="฿"
    elif location and ("uk" in location.lower() or "london" in location.lower()):
        currency = "£"
    
    # Build comprehensive prompt
    ad_generation_prompt = f"""
You are a direct response copywriter specializing in Meta lead generation ads. Create 3 complete ad variations for this business.

BUSINESS CONTEXT:
- Business: {business}
- Industry: {industry}
- Target Audience: {audience}
- Main Pain Points: {', '.join(pain_points[:3])}
- Unique Value: {', '.join(value_props[:2])}
- Current Offer: {offer}
- Price Tier: {price_tier}
- Brand Voice: {voice}
- Key Objections: {', '.join(objections[:2])}
- Urgency Factors: {', '.join(urgency[:2])}
- Location: {location}
- Currency: {currency}

REQUIREMENTS FOR EACH AD:
1. **Hook (Headline)**: Max 27 characters (META ENFORCES THIS)
2. **Body (Primary Text)**: Max 125 characters (META ENFORCES THIS)
3. **CTA Button**: Choose from: Learn More, Sign Up, Download, Book Now, Get Quote, Apply Now
4. **Creative Brief**: Describe the EXACT image/video needed
5. **Landing Page Headline**: The H1 that should greet users after clicking

Create 3 variations using these proven frameworks:

**VARIATION A - "Problem Agitation" (Cold Audience)**
**VARIATION B - "Social Proof" (Warm Audience)**  
**VARIATION C - "Offer/Urgency" (Hot Audience)**

Return ONLY valid JSON with this EXACT structure (no markdown, no code blocks):

{{
  "variations": [
    {{
      "angle": "Problem Agitation (Cold Traffic)",
      "target_stage": "Awareness",
      "hook": "exact 27-char hook here",
      "body": "exact 125-char body here",
      "cta": "CTA button text",
      "landing_page_headline": "H1 for landing page",
      "creative_brief": {{
        "format": "Static Image/Video/Carousel",
        "visual_description": "detailed description of what to show",
        "text_overlay": "any text on image (keep minimal)",
        "color_scheme": "recommended colors",
        "mood": "emotional tone"
      }},
      "why_this_works": "1-sentence strategic explanation"
    }},
    {{
      "angle": "Social Proof (Warm Traffic)",
      "target_stage": "Consideration",
      "hook": "...",
      "body": "...",
      "cta": "...",
      "landing_page_headline": "...",
      "creative_brief": {{}},
      "why_this_works": "..."
    }},
    {{
      "angle": "Offer/Urgency (Hot Traffic)",
      "target_stage": "Decision",
      "hook": "...",
      "body": "...",
      "cta": "...",
      "landing_page_headline": "...",
      "creative_brief": {{}},
      "why_this_works": "..."
    }}
  ],
  "targeting_strategy": {{
    "cold_audience": {{
      "interests": ["interest 1", "interest 2", "interest 3", "interest 4", "interest 5"],
      "behaviors": ["behavior 1", "behavior 2"],
      "demographics": "age range and income level",
      "exclude": ["exclude interest 1", "exclude interest 2"]
    }},
    "warm_audience": {{
      "retargeting": "Website visitors 30 days, Video viewers 50%+",
      "lookalike": "1% lookalike of leads/customers",
      "engagement": "Instagram/Facebook engagers 90 days"
    }},
    "hot_audience": {{
      "retargeting": "Landing page visitors, added to cart, form started",
      "email_list": "Upload existing customer list for lookalikes"
    }}
  }},
  "budget_recommendation": {{
    "daily_spend": "{currency}50 - {currency}100 / day",
    "split": "50% Cold (Var A), 30% Warm (Var B), 20% Hot (Var C)",
    "testing_plan": "Run all 3 for 4 days. Kill worst performer. Double budget on winner.",
    "expected_cpl": "{currency}15 - {currency}30 per lead",
    "break_even_math": "If your customer LTV is {currency}500, you can afford {currency}25/lead"
  }},
  "landing_page_checklist": [
    "✓ Clear headline matches ad promise",
    "✓ Lead form above the fold",
    "✗ Missing social proof/testimonials",
    "✓ Mobile-optimized design",
    "✗ No clear value proposition stated"
  ]
}}

CRITICAL RULES:
- Hooks must be EXACTLY under 27 characters
- Body must be EXACTLY under 125 characters
- Use {currency} symbol in all budget/cost mentions
- Be SPECIFIC with numbers
- Match brand voice: {voice}

Generate NOW:
"""

    # Call Gemini
    try:
        logger.info(f"Generating ads for {business} in {location}")
        
        model = genai.GenerativeModel('gemini-2.5-flash')
        response = model.generate_content(ad_generation_prompt)
        
        # Parse response
        response_text = response.text.strip()
        
        # Remove markdown if present
        if response_text.startswith('```'):
            response_text = response_text.split('```')[1]
            if response_text.startswith('json'):
                response_text = response_text[4:]
            response_text = response_text.rsplit('```', 1)[0]
        
        campaign_data = json.loads(response_text)
        
        # Validate character limits
        for var in campaign_data.get('variations', []):
            if len(var.get('hook', '')) > 27:
                logger.warning(f"Hook too long ({len(var['hook'])} chars), truncating")
                var['hook'] = var['hook'][:27]
            if len(var.get('body', '')) > 125:
                logger.warning(f"Body too long ({len(var['body'])} chars), truncating")
                var['body'] = var['body'][:125]
        
        logger.info(f"Successfully generated {len(campaign_data.get('variations', []))} ad variations")
        return campaign_data
        
    except json.JSONDecodeError as e:
        logger.error(f"Failed to parse AI response: {str(e)}")
        logger.error(f"Response text: {response_text[:500]}")
        raise ValueError("AI returned invalid JSON format")
        
    except Exception as e:
        logger.error(f"AI Copywriter Error: {str(e)}")
        raise


def validate_landing_page(url):
    """
    Analyze landing page quality and provide conversion optimization tips
    """
    
    validation_prompt = f"""
Analyze this landing page URL: {url}

You are a conversion rate optimization expert. Evaluate this landing page for lead generation effectiveness.

Return ONLY valid JSON (no markdown, no code blocks):

{{
  "page_score": 75,
  "critical_issues": [
    "No clear CTA above fold",
    "Missing social proof"
  ],
  "recommendations": [
    "Add testimonials in first screen",
    "Simplify lead form to 3 fields max"
  ],
  "estimated_conversion_rate": "2-4%",
  "biggest_leak": "Form too long - 8 fields will cause 60% drop-off"
}}

Be harsh but constructive.
"""
    
    try:
        logger.info(f"Validating landing page: {url}")
        
        model = genai.GenerativeModel('gemini-2.5-flash')
        response = model.generate_content(validation_prompt)
        
        response_text = response.text.strip()
        if response_text.startswith('```'):
            response_text = response_text.split('```')[1]
            if response_text.startswith('json'):
                response_text = response_text[4:]
            response_text = response_text.rsplit('```', 1)[0]
        
        result = json.loads(response_text)
        logger.info(f"Landing page score: {result.get('page_score', 'N/A')}")
        return result
        
    except Exception as e:
        logger.error(f"Landing page validation error: {str(e)}")
        return {
            "page_score": 0,
            "critical_issues": ["Could not analyze page"],
            "recommendations": ["Ensure page is publicly accessible"],
            "estimated_conversion_rate": "Unknown",
            "biggest_leak": "Unable to assess"
        }
