from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import HuggingFaceBgeEmbeddings
from langchain.vectorstores import Chroma
from dotenv import load_dotenv
import os
import uuid

load_dotenv()

CHROMA_PATH = "chroma_store"


def split_text(text: str, chunk_size=500, chunk_overlap=50):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap
    )
    return splitter.split_text(text)


def embed_and_store(chunks: list[str], doc_id: str = None):
    """
    Embeds text chunks and stores in ChromaDB.
    """
    embeddings = HuggingFaceBgeEmbeddings()
    vectorstore = Chroma(
        collection_name="pdf_chunks",
        embedding_function=embeddings,
        persist_directory=CHROMA_PATH
    )

    metadata = [{"doc_id": doc_id or str(uuid.uuid4())} for _ in chunks]
    vectorstore.add_texts(chunks, metadatas=metadata)
    vectorstore.persist()
    return metadata[0]["doc_id"]
