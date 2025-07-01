from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import OllamaEmbeddings
from langchain_community.llms import Ollama
from langchain.chains import RetrievalQA
from chromadb.config import Settings as ChromaSettings

def main():
    # 1. Load ChromaDB with telemetry disabled
    vector_db = Chroma(
        persist_directory="./chroma_db",
        embedding_function=OllamaEmbeddings(model="mistral"),
        client_settings=ChromaSettings(anonymized_telemetry=False)
    )

    # 2. Initialize DeepSeek-R1
    llm = Ollama(model="mistral")

    # 3. Set up RAG chain (sources still used internally but not returned)
    qa_chain = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=vector_db.as_retriever(search_kwargs={"k": 3}),
        return_source_documents=False  # Critical change
    )

    print("PDF Q&A System Ready. Type '/exit' to quit.\n")

    while True:
        query = input("\nYour question: ").strip()
        if query.lower() == "/exit":
            break
        
        if query:
            try:
                answer = qa_chain.invoke({"query": query})["result"]
                print(f"\nAnswer: {answer}\n")
            except Exception as e:
                print(f"Error: {e}")

if __name__ == "__main__":
    main()