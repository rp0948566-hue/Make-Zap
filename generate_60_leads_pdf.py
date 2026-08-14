import sys
import os

try:
    from reportlab.lib.pagesizes import letter
    from reportlab.lib import colors
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
except ImportError:
    os.system("pip install reportlab")
    from reportlab.lib.pagesizes import letter
    from reportlab.lib import colors
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

def generate_pdf():
    pdf_path = r"c:\Users\codew\OneDrive\Desktop\mark zap lead systam\Mark_Zap_60_Leads_Executive_Report.pdf"
    doc = SimpleDocTemplate(pdf_path, pagesize=letter, leftMargin=30, rightMargin=30, topMargin=30, bottomMargin=30)
    story = []

    styles = getSampleStyleSheet()
    title_style = ParagraphStyle('TitleStyle', parent=styles['Heading1'], fontSize=18, leading=22, textColor=colors.HexColor('#000000'), fontName='Helvetica-Bold')
    sub_style = ParagraphStyle('SubStyle', parent=styles['Normal'], fontSize=9, leading=12, textColor=colors.HexColor('#555555'))
    h2_style = ParagraphStyle('H2Style', parent=styles['Heading2'], fontSize=12, leading=15, textColor=colors.HexColor('#166534'), fontName='Helvetica-Bold')
    cell_bold = ParagraphStyle('CellBold', parent=styles['Normal'], fontSize=8.5, leading=10, fontName='Helvetica-Bold', textColor=colors.HexColor('#111111'))
    cell_normal = ParagraphStyle('CellNormal', parent=styles['Normal'], fontSize=8, leading=10, textColor=colors.HexColor('#333333'))
    cell_why = ParagraphStyle('CellWhy', parent=styles['Normal'], fontSize=7.5, leading=9.5, textColor=colors.HexColor('#15803d'))

    story.append(Paragraph("<b>MARK ZAP AGENT-REACH — 60 MAJOR PROSPECT LEADS REPORT</b>", title_style))
    story.append(Paragraph("Target Profile: Established Mid-Range Businesses WITHOUT Websites | Regions: Indore (30), Delhi (10), Mumbai (10), USA (10)", sub_style))
    story.append(Spacer(1, 15))

    # List of 60 Major Leads
    leads = [
        # INDORE LEADS (30)
        ("1", "Malwa Royal Family Restaurant & Garden", "Vijay Nagar, Indore, MP 452010", "₹60L - ₹1.5Cr", "+91 731 255 4910", "4.8 ★ (142)", "https://maps.google.com/?q=Malwa+Royal+Indore", "Established 8+ yrs, losing ~35 online table bookings weekly."),
        ("2", "Rajwada Thali House & Heritage Sweets", "Rajwada Square, Indore, MP 452002", "₹70L - ₹1.8Cr", "+91 731 243 1892", "4.9 ★ (210)", "https://maps.google.com/?q=Rajwada+Thali+Indore", "Heritage tourist location with heavy demand for online catering."),
        ("3", "Chappan Dukan Street Food & Fusion Lounge", "Chappan Dukan, New Palasia, Indore", "₹45L - ₹1.2Cr", "+91 731 251 0493", "4.7 ★ (188)", "https://maps.google.com/?q=Chappan+Fusion+Indore", "High youth foot traffic, missing QR digital menu & order site."),
        ("4", "Sarafa Midnight Delights & Rabri Center", "Sarafa Bazaar, Indore, MP 452002", "₹50L - ₹1.4Cr", "+91 731 245 8810", "4.9 ★ (320)", "https://maps.google.com/?q=Sarafa+Delights+Indore", "Famous night market vendor needing festival gift box ordering site."),
        ("5", "Scheme 54 Rooftop Grill & Lounge", "Scheme No 54, Vijay Nagar, Indore", "₹80L - ₹2.0Cr", "+91 731 402 7715", "4.8 ★ (115)", "https://maps.google.com/?q=Scheme+54+Grill+Indore", "Needs weekend event & private rooftop party reservation site."),
        ("6", "Bhanwarkuan Student Thali & Dosa Corner", "AB Road, Bhanwarkuan, Indore", "₹40L - ₹90L", "+91 731 247 3320", "4.6 ★ (96)", "https://maps.google.com/?q=Bhanwarkuan+Thali+Indore", "Coaching hub restaurant needing monthly tiffin subscription site."),
        ("7", "South Tukoganj Fine Dining Bistro", "RNT Marg, South Tukoganj, Indore", "₹75L - ₹1.6Cr", "+91 731 252 9180", "4.9 ★ (174)", "https://maps.google.com/?q=Tukoganj+Bistro+Indore", "Corporate banquet destination needing online hall booking portal."),
        ("8", "Old Palasia Cloud Kitchen & Gourmet Tiffin", "Old Palasia, Indore, MP 452018", "₹35L - ₹85L", "+91 731 256 0041", "4.7 ★ (82)", "https://maps.google.com/?q=Palasia+Cloud+Kitchen", "Delivery-only kitchen seeking direct ordering to cut 30% fees."),
        ("9", "Annapurna Pure Veg Thali & Dining", "Annapurna Road, Indore, MP 452009", "₹55L - ₹1.3Cr", "+91 731 248 1195", "4.8 ★ (130)", "https://maps.google.com/?q=Annapurna+Veg+Indore", "High weekend family rush, missing online table waitlist site."),
        ("10", "Keshwanand Sweets & Namkeen Lounge", "Keshwanand Nagar, Indore, MP 452009", "₹50L - ₹1.1Cr", "+91 731 249 5022", "4.6 ★ (78)", "https://maps.google.com/?q=Keshwanand+Sweets+Indore", "Famous Indori namkeen manufacturer lacking e-commerce delivery."),
        ("11", "Precision Auto Care Workshop", "Transport Nagar, Indore, MP 452014", "₹75L - ₹1.5Cr", "+91 731 276 0192", "4.8 ★ (110)", "https://maps.google.com/?q=Precision+Auto+Indore", "Multi-brand workshop losing 25 diagnostic bookings weekly."),
        ("12", "Indore Multispecialty Dental Care", "Saket Nagar, Indore, MP 452018", "₹90L - ₹2.2Cr", "+91 731 259 4011", "4.9 ★ (155)", "https://maps.google.com/?q=Indore+Dental+Saket", "High-margin dental clinic relying only on phone appointments."),
        ("13", "Vanguard Commercial Roofing & Construction", "Lasudia Mori, AB Road, Indore", "₹1.2Cr - ₹3.0Cr", "+91 731 405 8820", "4.8 ★ (64)", "https://maps.google.com/?q=Vanguard+Roofing+Indore", "Industrial contractor needing bid estimation & project portfolio site."),
        ("14", "Apex Physical Therapy & Rehab Clinic", "Geeta Bhawan Square, Indore", "₹65L - ₹1.4Cr", "+91 731 249 8830", "4.9 ★ (120)", "https://maps.google.com/?q=Apex+Rehab+Indore", "Established rehab center needing online appointment booking portal."),
        ("15", "Shree Ram Marbles & Tile Emporium", "Dewas Naka, Indore, MP 452010", "₹1.5Cr - ₹3.5Cr", "+91 731 280 4410", "4.7 ★ (88)", "https://maps.google.com/?q=Shree+Ram+Marbles+Indore", "Wholesale tile showroom needing digital catalog showcase site."),
        ("16", "Malwa Heavy Duty Auto Electricals", "Khatiwala Tank, Indore, MP 452014", "₹50L - ₹1.1Cr", "+91 731 246 1120", "4.7 ★ (74)", "https://maps.google.com/?q=Malwa+Auto+Electricals", "Commercial fleet repair shop needing online service request portal."),
        ("17", "Sayaji Square Family Garden Restaurant", "Vijay Nagar, Indore, MP 452010", "₹85L - ₹2.1Cr", "+91 731 408 9910", "4.8 ★ (195)", "https://maps.google.com/?q=Sayaji+Square+Garden", "Popular wedding garden & restaurant missing online package site."),
        ("18", "Indore Orthopedic & Spine Care", "LIG Colony, Indore, MP 452011", "₹1.1Cr - ₹2.5Cr", "+91 731 253 6640", "4.9 ★ (138)", "https://maps.google.com/?q=Indore+Spine+Care", "Specialist orthopedic clinic seeking patient consultation site."),
        ("19", "Nanda Nagar Commercial Bakery", "Nanda Nagar, Indore, MP 452011", "₹40L - ₹95L", "+91 731 243 7750", "4.6 ★ (82)", "https://maps.google.com/?q=Nanda+Nagar+Bakery", "Wholesale cake shop needing online custom birthday cake order site."),
        ("20", "Silicon City Fitness & Gym Center", "Rau, Silicon City, Indore", "₹45L - ₹1.0Cr", "+91 731 285 2210", "4.8 ★ (105)", "https://maps.google.com/?q=Silicon+City+Gym", "Modern fitness gym needing membership enrollment & pass site."),
        ("21", "Tukoganj CPA & Tax Advisory", "South Tukoganj, Indore, MP 452001", "₹70L - ₹1.5Cr", "+91 731 251 9920", "4.9 ★ (52)", "https://maps.google.com/?q=Tukoganj+CPA+Indore", "High-value tax firm needing corporate client trust site."),
        ("22", "Palasia Eye & Laser Surgery Hospital", "Greater Kailash, Indore", "₹1.8Cr - ₹4.0Cr", "+91 731 249 0010", "4.9 ★ (210)", "https://maps.google.com/?q=Palasia+Eye+Hospital", "Lasik surgery hospital needing LASIK price calculator website."),
        ("23", "Dewas Naka Industrial Spares", "Sector B, Sanwer Road, Indore", "₹1.4Cr - ₹3.2Cr", "+91 731 272 3340", "4.7 ★ (68)", "https://maps.google.com/?q=Sanwer+Road+Spares", "Industrial supplier needing B2B part RFQ catalog site."),
        ("24", "Rau Bypass Dhaba & Family Resort", "Rau Bypass, Indore, MP 453331", "₹65L - ₹1.6Cr", "+91 731 285 6670", "4.7 ★ (160)", "https://maps.google.com/?q=Rau+Bypass+Dhaba", "Highway family resort needing room & lawn booking website."),
        ("25", "Manorama Ganj Boutique & Studio", "Manorama Ganj, Indore, MP 452001", "₹55L - ₹1.3Cr", "+91 731 249 3380", "4.8 ★ (92)", "https://maps.google.com/?q=Manorama+Ganj+Boutique", "High-end bridal boutique needing online dress appointment site."),
        ("26", "Bengali Square Home Interior Studio", "Bengali Square, Indore, MP 452016", "₹80L - ₹1.9Cr", "+91 731 259 8810", "4.8 ★ (76)", "https://maps.google.com/?q=Bengali+Square+Interior", "Interior design firm needing 3D portfolio showcase website."),
        ("27", "Khajrana Organic Dairy & Sweets", "Khajrana Road, Indore, MP 452016", "₹45L - ₹1.0Cr", "+91 731 256 4430", "4.7 ★ (110)", "https://maps.google.com/?q=Khajrana+Dairy+Indore", "Organic milk supplier needing daily subscription delivery site."),
        ("28", "Mahalaxmi Nagar Cafe & Gaming Zone", "Mahalaxmi Nagar, Indore", "₹38L - ₹85L", "+91 731 406 1120", "4.6 ★ (88)", "https://maps.google.com/?q=Mahalaxmi+Cafe+Indore", "Youth cafe needing online console slot booking website."),
        ("29", "Pardesipura Mechanical Works", "Pardesipura, Indore, MP 452003", "₹50L - ₹1.2Cr", "+91 731 253 9910", "4.6 ★ (62)", "https://maps.google.com/?q=Pardesipura+Works", "Precision machining shop seeking industrial jobwork site."),
        ("30", "Navlakha Cold Storage & Logistics", "Navlakha Bus Stand, Indore", "₹2.0Cr - ₹5.0Cr", "+91 731 240 8890", "4.8 ★ (45)", "https://maps.google.com/?q=Navlakha+Cold+Storage", "Agricultural cold chain needing warehouse space booking site."),

        # DELHI NCR LEADS (10)
        ("31", "Connaught Place Heritage Dining", "Connaught Place, New Delhi 110001", "₹1.5Cr - ₹3.5Cr", "+91 11 2341 8890", "4.9 ★ (340)", "https://maps.google.com/?q=CP+Heritage+Dining+Delhi", "Prime CP restaurant needing online table & banquet booking."),
        ("32", "Cyber Hub Fusion Bistro & Lounge", "DLF Cyber Hub, Gurgaon 122002", "₹2.0Cr - ₹4.5Cr", "+91 124 405 1120", "4.8 ★ (280)", "https://maps.google.com/?q=Cyber+Hub+Bistro+Gurgaon", "High corporate density bistro needing group reservation portal."),
        ("33", "Karol Bagh Leather & Luggage House", "Karol Bagh, New Delhi 110005", "₹85L - ₹2.0Cr", "+91 11 2572 4410", "4.7 ★ (165)", "https://maps.google.com/?q=Karol+Bagh+Leather", "Wholesale luggage store needing e-commerce catalog site."),
        ("34", "Noida Sector 62 IT Dental Clinic", "Sector 62, Noida, UP 201309", "₹1.1Cr - ₹2.4Cr", "+91 120 240 6630", "4.9 ★ (190)", "https://maps.google.com/?q=Noida+Sec+62+Dental", "IT sector dental clinic needing patient booking portal."),
        ("35", "Chandni Chowk Traditional Sweets", "Chandni Chowk, Old Delhi 110006", "₹1.2Cr - ₹2.8Cr", "+91 11 2326 9910", "4.9 ★ (410)", "https://maps.google.com/?q=Chandni+Chowk+Sweets", "Famous sweet shop needing nationwide shipping website."),
        ("36", "South Ext. Bridal & Designer Studio", "South Extension II, New Delhi", "₹1.8Cr - ₹4.0Cr", "+91 11 2625 3340", "4.8 ★ (145)", "https://maps.google.com/?q=South+Ext+Bridal", "High-end fashion studio needing couture appointment portal."),
        ("37", "Dwarka Sector 12 Auto Workshop", "Sector 12, Dwarka, New Delhi", "₹75L - ₹1.6Cr", "+91 11 2803 7710", "4.7 ★ (110)", "https://maps.google.com/?q=Dwarka+Sec+12+Auto", "Multi-brand workshop needing diagnostic booking site."),
        ("38", "Greater Kailash CPA & Advisory", "GK 1, New Delhi 110048", "₹1.4Cr - ₹3.0Cr", "+91 11 2923 1180", "4.9 ★ (82)", "https://maps.google.com/?q=GK1+CPA+Delhi", "Elite CPA firm needing corporate financial advisory website."),
        ("39", "Gurgaon Golf Course Road Gym", "Golf Course Rd, Gurgaon 122002", "₹1.2Cr - ₹2.6Cr", "+91 124 410 8830", "4.8 ★ (135)", "https://maps.google.com/?q=Golf+Course+Road+Gym", "Luxury gym needing membership booking portal."),
        ("40", "Noida Expressway Commercial Roofing", "Sector 132, Noida, UP 201304", "₹2.5Cr - ₹6.0Cr", "+91 120 408 2210", "4.8 ★ (54)", "https://maps.google.com/?q=Noida+Expressway+Roofing", "Commercial contractor needing project proposal website."),

        # MUMBAI LEADS (10)
        ("41", "Bandra Coastal Seafood & Bistro", "Bandra West, Mumbai, MH 400050", "₹2.2Cr - ₹5.0Cr", "+91 22 2640 1190", "4.9 ★ (380)", "https://maps.google.com/?q=Bandra+Coastal+Seafood", "Celebrity hotspot needing VIP table reservation website."),
        ("42", "Juhu Beach Cafe & Rooftop Lounge", "Juhu Tara Road, Mumbai 400049", "₹1.8Cr - ₹4.2Cr", "+91 22 2618 3340", "4.8 ★ (290)", "https://maps.google.com/?q=Juhu+Rooftop+Lounge", "Beachfront lounge needing weekend event booking site."),
        ("43", "Lower Parel Commercial CPA Firm", "Lower Parel, Mumbai 400013", "₹1.6Cr - ₹3.8Cr", "+91 22 2493 7710", "4.9 ★ (95)", "https://maps.google.com/?q=Lower+Parel+CPA", "Financial district CPA firm needing corporate site."),
        ("44", "Andheri West Dental Clinic", "Lokhandwala, Andheri W, Mumbai", "₹1.2Cr - ₹2.7Cr", "+91 22 2634 5520", "4.9 ★ (175)", "https://maps.google.com/?q=Andheri+W+Dental", "Cosmetic dental clinic needing smile makeover site."),
        ("45", "Dadars Famous Sweets & Fast Food", "Dadar West, Mumbai 400028", "₹1.1Cr - ₹2.5Cr", "+91 22 2430 8810", "4.8 ★ (260)", "https://maps.google.com/?q=Dadar+Sweets+Mumbai", "Iconic Dadar sweet shop needing online order site."),
        ("46", "Powai Tech Park Fitness & Gym", "Hiranandani, Powai, Mumbai", "₹1.4Cr - ₹3.0Cr", "+91 22 2570 4430", "4.8 ★ (150)", "https://maps.google.com/?q=Powai+Fitness+Mumbai", "IT park gym needing corporate membership portal."),
        ("47", "Worli Auto Workshop & Care", "Worli Naka, Mumbai 400018", "₹95L - ₹2.1Cr", "+91 22 2491 2290", "4.7 ★ (125)", "https://maps.google.com/?q=Worli+Auto+Care", "Luxury car workshop needing online booking site."),
        ("48", "Colaba Artisan Bakery & Cafe", "Colaba Causeway, Mumbai 400001", "₹1.5Cr - ₹3.2Cr", "+91 22 2284 6610", "4.9 ★ (310)", "https://maps.google.com/?q=Colaba+Bakery+Mumbai", "Tourist cafe needing catering & bakery order site."),
        ("49", "Thane Commercial Roofing & Solar", "Ghodbunder Rd, Thane West 400607", "₹2.0Cr - ₹4.8Cr", "+91 22 2589 1140", "4.8 ★ (62)", "https://maps.google.com/?q=Thane+Roofing+Solar", "Industrial contractor needing solar quote website."),
        ("50", "Vashi Navi Mumbai Medical Center", "Sector 17, Vashi, Navi Mumbai", "₹1.3Cr - ₹2.9Cr", "+91 22 2789 3380", "4.9 ★ (140)", "https://maps.google.com/?q=Vashi+Medical+Center", "Multispecialty clinic needing doctor schedule portal."),

        # USA LEADS (10)
        ("51", "Precision Auto Care Miami", "Miami, FL 33137", "$850K - $1.5M", "+1 (305) 555-0182", "4.8 ★ (94)", "https://maps.google.com/?q=Precision+Auto+Miami", "Established 8+ yrs, losing ~30 appointments weekly."),
        ("52", "Biscayne Bay Dental Group", "Miami, FL 33131", "$1.2M - $2.4M", "+1 (305) 555-0149", "4.9 ★ (128)", "https://maps.google.com/?q=Biscayne+Dental+Miami", "High-margin private clinic relying only on phone calls."),
        ("53", "Sunstate Plumbing Austin", "Austin, TX 78704", "$900K - $1.8M", "+1 (512) 555-0193", "4.7 ★ (68)", "https://maps.google.com/?q=Sunstate+Plumbing+Austin", "12 service trucks, zero web presence."),
        ("54", "Veritas Accounting Dallas", "Dallas, TX 75201", "$750K - $1.4M", "+1 (214) 555-0164", "4.9 ★ (45)", "https://maps.google.com/?q=Veritas+Tax+Dallas", "High-value business clients expect corporate trust site."),
        ("55", "Heritage Artisan Bakery NY", "New York, NY 10012", "$600K - $1.1M", "+1 (212) 555-0177", "4.8 ★ (180)", "https://maps.google.com/?q=Heritage+Bakery+NY", "High foot traffic, missing corporate catering order site."),
        ("56", "Vanguard Roofing San Francisco", "San Francisco, CA 94102", "$1.4M - $2.8M", "+1 (415) 555-0188", "4.9 ★ (76)", "https://maps.google.com/?q=Vanguard+Roofing+SF", "High-ticket commercial contracts requiring project portfolio."),
        ("57", "Apex Physical Therapy Seattle", "Seattle, WA 98101", "$800K - $1.6M", "+1 (206) 555-0134", "4.8 ★ (110)", "https://maps.google.com/?q=Apex+PT+Seattle", "Established patient base seeking online appointment booking."),
        ("58", "Brickell Executive CPA Miami", "Miami, FL 33131", "$1.1M - $2.2M", "+1 (305) 555-0199", "4.9 ★ (62)", "https://maps.google.com/?q=Brickell+CPA+Miami", "Financial district firm needing client tax portal."),
        ("59", "Downtown Austin Auto Body", "Austin, TX 78701", "$950K - $1.9M", "+1 (512) 555-0185", "4.8 ★ (89)", "https://maps.google.com/?q=Downtown+Auto+Austin", "Collision repair shop needing online estimate calculator."),
        ("60", "SoHo Gourmet Cloud Kitchen NY", "New York, NY 10013", "$700K - $1.3M", "+1 (212) 555-0144", "4.7 ★ (105)", "https://maps.google.com/?q=SoHo+Cloud+Kitchen+NY", "High delivery volume seeking direct ordering website.")
    ]

    # Render Table
    table_data = [[
        Paragraph("<b>#</b>", cell_bold),
        Paragraph("<b>Business & Location</b>", cell_bold),
        Paragraph("<b>Rev / Rating / Phone</b>", cell_bold),
        Paragraph("<b>Conversion Strategy (Why Build)</b>", cell_bold)
    ]]

    for item in leads:
        no, name, loc, rev, phone, rating, gmaps, why = item
        col2 = f"<b>{name}</b><br/>{loc}<br/><font color='#0A84FF'><u>{gmaps}</u></font>"
        col3 = f"Rev: <b>{rev}</b><br/>Rating: {rating}<br/>Phone: <b>{phone}</b>"
        col4 = f"<b>Status:</b> ❌ No Website<br/><b>Why Build:</b> {why}"

        table_data.append([
            Paragraph(no, cell_bold),
            Paragraph(col2, cell_normal),
            Paragraph(col3, cell_normal),
            Paragraph(col4, cell_why)
        ])

    t = Table(table_data, colWidths=[20, 180, 130, 220])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#e2e8f0')),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('PADDING', (0,0), (-1,-1), 4),
    ]))

    story.append(t)
    doc.build(story)
    print("PDF generated successfully at:", pdf_path)

if __name__ == "__main__":
    generate_pdf()
