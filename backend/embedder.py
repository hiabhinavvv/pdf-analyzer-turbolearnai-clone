# embedder.py
import os
import shutil
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings
import sys

def clear_chroma_db(db_path="chroma_db"):
    """Remove existing ChromaDB directory if it exists"""
    if os.path.exists(db_path):
        shutil.rmtree(db_path)
        print(f"Removed existing ChromaDB at '{db_path}'")

def create_vector_db(pdf_path, db_path="chroma_db"):
    """Create new Chroma vector database from a given PDF"""
    try:
        print(f"Loading PDF: {pdf_path}")
        loader = PyPDFLoader(pdf_path)
        pages = loader.load_and_split()

        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len,
            is_separator_regex=False,
        )
        chunks = text_splitter.split_documents(pages)
        print(f"Split PDF into {len(chunks)} chunks")

        embedding = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
        vector_db = Chroma.from_documents(
            documents=chunks,
            embedding=embedding,
            persist_directory=db_path
        )
        vector_db.persist()
        print(f"VectorDB created and persisted at '{db_path}'")
        return True
    except Exception as e:
        print(f"Error creating vector DB: {e}")
        return False

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python embedder.py <pdf_path>")
        sys.exit(1)
    
    pdf_path = sys.argv[1]
    clear_chroma_db()
    success = create_vector_db(pdf_path)
    sys.exit(0 if success else 1)