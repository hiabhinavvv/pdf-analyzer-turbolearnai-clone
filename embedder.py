from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain.embeddings import HuggingFaceEmbeddings

# 1. Load and Split PDF
loader = PyPDFLoader("pdf-analyzer-turbolearnai-clone/data/BERT.pdf")  # Replace with your PDF path
pages = loader.load_and_split()

# 2. Split into Chunks (for better retrieval)
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=100,  # Adjust based on doc complexity
    chunk_overlap=20  # Helps maintain context
)
chunks = text_splitter.split_documents(pages)

# 3. Create VectorDB (ChromaDB)
vector_db = Chroma.from_documents(
    documents=chunks,
    embedding = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
),
    persist_directory="./chroma_db"  # Saves locally
)

print("VectorDB created successfully at './chroma_db'!")