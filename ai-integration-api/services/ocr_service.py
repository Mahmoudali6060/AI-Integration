from PIL import Image, ImageEnhance
import pytesseract
import io
import os
from dotenv import load_dotenv
import re

load_dotenv()

TESSERACT_PATH = os.getenv("TESSERACT_PATH")
pytesseract.pytesseract.tesseract_cmd = TESSERACT_PATH

def extract_text(image_bytes: bytes) -> str:
    image = Image.open(io.BytesIO(image_bytes)).convert("L")  # Grayscale

    # تعزيز التباين فقط
    enhancer = ImageEnhance.Contrast(image)
    image = enhancer.enhance(1.5)  # مش عالي أوي

    # OCR config
    custom_config = r'--oem 3 --psm 4'
    text = pytesseract.image_to_string(image, lang='eng', config=custom_config)

    return smart_clean_text(text.strip())



def smart_clean_text(text: str) -> str:
    # استبدال أخطاء شائعة في قراءة OCR العربي
    replacements = {
        " 0 ": "  ........   ",
        "دس": "...",
        "بس": "...",
        "ة مو ل": "تشمل",
        "ٍ ير": "مدير",
        "ال > ا": "الإدارة",
        "بتاديخ": "بتاريخ",
        "ما": "مع",  # حسب السياق
        "سلمه": "سلمها",  # تخمين
        "1234 0": "",  # رقم عشوائي ظاهر مكان تنسيق
         "صلمة": "سلمه",

    }


    # تطبيق الاستبدالات
    for wrong, right in replacements.items():
        text = text.replace(wrong, right)

    # حذف التطويل والرموز الزخرفية المحتملة
    text = re.sub(r'[ـ“”"•●■▪️▪︎✦*+~_]', '', text)

    # إزالة أي تكرارات حرفية غريبة
    text = re.sub(r'(.)\1{3,}', r'\1\1', text)

    # حذف الأسطر الفارغة الزائدة
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    return '\n'.join(lines)
