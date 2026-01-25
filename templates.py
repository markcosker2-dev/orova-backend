import random

def generate_campaign_strategy(product_name, target_audience, usp, location="Global"):
    """
    Generates a complete recommended campaign:
    1. Three distinct ad variations (Logical, Emotional, Social).
    2. A daily budget recommendation strategy.
    3. Meta targeting suggestions.
    4. Location adaptation (Currency/Nuance)
    """
    
    # Location Logic
    currency = "$"
    region_nuance = ""
    if location and ("bangkok" in location.lower() or "thailand" in location.lower()):
        currency = "฿"
        region_nuance = " (Localized for Southeast Asia Market)"
    elif location and ("uk" in location.lower() or "london" in location.lower()):
        currency = "£"
    
    # --- 1. Ad Variations ---
    variations = []
    
    # Angle A: Logical / Value-Stack (The "Why" - Cold Audience)
    variations.append({
        "angle": "Logical / Value-Stack",
        "description": "Best for Cold Audiences who need facts.",
        "hook": f"Stop guessing. Start converting in {location}.",
        "body": f"If you are {target_audience}, you know the pain of inefficiency. {product_name} is engineered to solve this.\n\n✅ Feature 1: {usp}\n✅ Feature 2: Built for speed\n✅ Feature 3: No more manual work\n\nGet the tool that professionals use.",
        "creative": f"Clean product UI shot showing the '{usp}' feature in action. Text overlay: 'Efficiency Unlocked'.",
        "cta": "Learn More"
    })
    
    # Angle B: Emotional / PAS (The "Pain" - Warm Audience)
    variations.append({
        "angle": "Emotional / Problem-Solver",
        "description": "Best for Warm Audiences or high-intent leads.",
        "hook": f"Are you tired of feeling behind, {target_audience}?",
        "body": f"The old way of working is broken. It drains your time and energy. But imagine a world where {usp} happens automatically.\n\n{product_name} isn't just a tool; it's your freedom back. Don't let another day go by struggling.",
        "creative": "A split screen: Left side black/white showing frustration. Right side bright/colorful showing success with the product.",
        "cta": "Get Started"
    })
    
    # Angle C: Social / UGC (The "Proof" - Retargeting/Broad)
    variations.append({
        "angle": "Social Proof / UGC",
        "description": "Best for Retargeting and building trust.",
        "hook": f"Top rated tool in {location}.",
        "body": f"\"I never thought {usp} could be this easy until I tried {product_name}.\"\n\nSee why thousands of {target_audience} in {location} are switching over. The results speak for themselves.",
        "creative": "Selfie-style video of a user holding the product (or phone) looking excited. High energy caption stickers.",
        "cta": "Shop Now"
    })

    # --- 2. Targeting Strategy ---
    targeting = generate_targeting_v3(product_name, target_audience)
    
    # --- 3. Budget Strategy ---
    budget = calculate_budget_strategy(target_audience, currency, location)

    return {
        "variations": variations,
        "targeting": targeting,
        "budget": budget
    }

def generate_targeting_v3(product, audience):
    """Strategic targeting based on product category and audience"""
    
    # Industry-specific interest mapping
    targeting_map = {
        'gym': {
            'interests': ['Physical fitness', 'Bodybuilding', 'CrossFit', 'Gym', 'Health club'],
            'behaviors': ['Fitness enthusiasts', 'Health and wellness'],
            'category': 'Fitness'
        },
        'restaurant': {
            'interests': ['Foodie', 'Restaurants', 'Food delivery', 'Fine dining', 'Cooking'],
            'behaviors': ['Frequent diners', 'Food and dining'],
            'category': 'Food & Beverage'
        },
        'saas': {
            'interests': ['Software', 'SaaS', 'Cloud computing', 'Business software', 'Productivity tools'],
            'behaviors': ['Small business owners', 'Technology early adopters'],
            'category': 'Technology'
        },
        'ecommerce': {
            'interests': ['Online shopping', 'E-commerce', 'Shopping and fashion', 'Retail'],
            'behaviors': ['Engaged shoppers', 'Online purchasers'],
            'category': 'E-commerce'
        },
        'real_estate': {
            'interests': ['Real estate', 'Property', 'Home buying', 'Residential real estate'],
            'behaviors': ['Likely to move', 'New homeowners'],
            'category': 'Real Estate'
        },
        'automotive': {
            'interests': ['Cars', 'Automobiles', 'Car buying', 'Auto shows'],
            'behaviors': ['Car buyers', 'Auto enthusiasts'],
            'category': 'Automotive'
        },
        'healthcare': {
            'interests': ['Health care', 'Medical services', 'Wellness', 'Dentistry'],
            'behaviors': ['Health-conscious consumers'],
            'category': 'Healthcare'
        }
    }
    
    # Detect category from product name and audience
    product_lower = product.lower()
    audience_lower = audience.lower()
    category = 'saas'  # Default
    
    if any(word in product_lower or word in audience_lower for word in ['gym', 'fitness', 'training', 'workout']):
        category = 'gym'
    elif any(word in product_lower or word in audience_lower for word in ['restaurant', 'food', 'cafe', 'dining']):
        category = 'restaurant'
    elif any(word in product_lower or word in audience_lower for word in ['shop', 'store', 'clothing', 'fashion', 'ecommerce', 'e-commerce']):
        category = 'ecommerce'
    elif any(word in product_lower or word in audience_lower for word in ['property', 'real estate', 'realtor', 'home']):
        category = 'real_estate'
    elif any(word in product_lower or word in audience_lower for word in ['car', 'auto', 'vehicle', 'dealership']):
        category = 'automotive'
    elif any(word in product_lower or word in audience_lower for word in ['health', 'medical', 'clinic', 'doctor', 'dental']):
        category = 'healthcare'
    
    target = targeting_map.get(category, targeting_map['saas'])
    
    return {
        "interests": ", ".join(target['interests'][:4]),  # Top 4 interests
        "behaviors": ", ".join(target['behaviors']),
        "demographics": "Ages 24-55 (Exclude bottom 50% income)",
        "category": target['category']  # Return detected category
    }


def calculate_budget_strategy(audience, currency="$", location="Global"):
    """
    Algorithmic budget recommendation with CPC-based reasoning
    """
    # Cost per click estimates by region
    cpc_estimates = {
        'bangkok': 0.30,
        'thailand': 0.30,
        'uk': 1.20,
        'london': 1.50,
        'us': 1.80,
        'new york': 2.00,
        'los angeles': 1.70,
        'default': 1.00
    }
    
    location_lower = location.lower()
    cpc = next((v for k, v in cpc_estimates.items() if k in location_lower), cpc_estimates['default'])
    
    # Calculate recommended spend
    target_clicks_per_day = 50
    daily_min = int(target_clicks_per_day * cpc * 0.8)
    daily_max = int(target_clicks_per_day * cpc * 1.5)
    
    # Currency conversion
    if currency == "฿":
        daily_min = int(daily_min * 33)  # USD to THB
        daily_max = int(daily_max * 33)
        cpc_display = f"฿{cpc * 33:.0f}"
    elif currency == "£":
        daily_min = int(daily_min * 0.79)  # USD to GBP
        daily_max = int(daily_max * 0.79)
        cpc_display = f"£{cpc * 0.79:.2f}"
    else:
        cpc_display = f"${cpc:.2f}"
    
    # Expected conversions (2-4% CTR baseline)
    expected_clicks = target_clicks_per_day
    expected_conversions_low = int(expected_clicks * 0.02)
    expected_conversions_high = int(expected_clicks * 0.04)
    
    return {
        "daily_spend": f"{currency}{daily_min:,} - {currency}{daily_max:,} / day",
        "split": "50% Cold (Logical), 30% Warm (Emotional), 20% Retargeting (Social)",
        "testing_duration": "4-7 Days before killing losers",
        "reasoning": f"Based on avg. CPC of {cpc_display} in {location}, targeting {target_clicks_per_day} clicks/day",
        "expected_results": f"Expected: {expected_clicks} clicks/day → {expected_conversions_low}-{expected_conversions_high} conversions at 2-4% rate"
    }
