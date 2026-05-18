import requests
import os

DIGILOCKER_API_URL = os.getenv('DIGILOCKER_API_URL', 'https://api.digilocker.gov.in/1/document')
DIGILOCKER_API_KEY = os.getenv('DIGILOCKER_API_KEY', '')

def push_to_digilocker(marksheet_data, pdf_path, student_info):
    """
    Push generated marksheet PDF to Digilocker.
    Requires college to be registered as an issuer on Digilocker.
    API credentials must be obtained from Digilocker issuer portal.
    """
    if not DIGILOCKER_API_KEY:
        return None, 'Digilocker API key not configured'

    try:
        with open(pdf_path, 'rb') as f:
            response = requests.post(
                DIGILOCKER_API_URL,
                headers={
                    'Authorization': f'Bearer {DIGILOCKER_API_KEY}',
                    'Content-Type': 'application/pdf',
                },
                params={
                    'doctype': 'MKSHT',                          # Marksheet document type
                    'uid': student_info.get('aadhaar_number'),    # Student Aadhaar
                    'ref': marksheet_data['reference_number'],
                },
                data=f.read(),
                timeout=30
            )
        if response.status_code == 200:
            doc_id = response.json().get('docid')
            return doc_id, None
        return None, f'Digilocker API error: {response.text}'
    except Exception as e:
        return None, str(e)
