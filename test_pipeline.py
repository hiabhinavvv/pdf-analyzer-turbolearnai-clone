print("test_pipeline.py is running") 
from app.pdf_utils import extract_text_from_pdf
from app.embedder import split_text, embed_and_store

# 🔁 Step 1: Load a sample PDF
pdf_path = "example.pdf"  # Make sure this file exists in your root dir
text = extract_text_from_pdf(pdf_path)
print("✅ Extracted text length:", len(text))

# 🔁 Step 2: Chunk it
chunks = split_text(text)
print(f"✅ Split into {len(chunks)} chunks")

# 🔁 Step 3: Embed and store
doc_id = embed_and_store(chunks)
print(f"✅ Chunks embedded and saved with doc_id: {doc_id}")
