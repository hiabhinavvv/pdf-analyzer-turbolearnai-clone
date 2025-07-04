# rag.py
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.llms import Ollama
from langchain.prompts import PromptTemplate
from langchain.chains import RetrievalQA
import re
import sys

prompt_template = """
You are an advanced AI assistant specialized in extracting, summarizing, and enriching technical information from documents. Your responses must be precise, well-structured, and tailored for technical users.

**Instructions:**
1. **Strict Context-Based Answers:**  
   - Use ONLY the provided context to answer. Never hallucinate or invent details.  
   - If the answer isn’t found, reply: “Not found in the document.”  

2. **Technical Enrichment (When Needed):**  
   - For complex terms/concepts, add a **brief** 1–2 line explanation (as if sourced from public knowledge).  
   - Example:  
     - *"TCP/IP (Transmission Control Protocol/Internet Protocol): The foundational communication protocol suite for the internet."*  

3. **Response Format:**  
   - **Prioritize bullet points** for clarity. Use paragraphs only for nuanced explanations.  
   - Structure:  
     - **Direct Answer** (if available in context).  
     - **Supporting Details** (key points from context).  
     - **Technical Enrichment** (if applicable).  

4. **Optimization for DeepSeek-R1:**  
   - Keep responses concise but technically dense. Avoid fluff.  
   - Use simple markdown (e.g., `**bold**` for emphasis, `-` for bullets).  

**Example Output:**  
Question: *What is the purpose of API rate limiting?*  
Answer:  
- **Purpose:** To control the number of requests a user/service can make to an API within a timeframe.  
- **Context Support:** [Document mentions "rate limiting prevents server overload"].  
- **Technical Note:** Often measured in requests/second (e.g., 1000 reqs/min).  

-----------------
CONTEXT:
{context}
-----------------

QUESTION: {question}

ANSWER:
"""

prompt = PromptTemplate(
    template=prompt_template,
    input_variables=["context", "question"]
)

def remove_think_blocks(text):
    return re.sub(r"<think>.*?</think>", "", text, flags=re.DOTALL).strip()
    cleaned = re.sub(r"(?<!\n)(\*\*[A-Z][^*]+?:\*\*)", r"\n\1", cleaned)
    return cleaned.strip()

def query_document(question, filename):
    try:
        # Load ChromaDB
        vector_db = Chroma(
            embedding_function=HuggingFaceEmbeddings(
                model_name="sentence-transformers/all-MiniLM-L6-v2"
            ),
            persist_directory="./chroma_db"
        )

        # Initialize LLM
        llm = Ollama(model="mistral")

        # Set up RAG chain
        qa_chain = RetrievalQA.from_chain_type(
            llm=llm,
            chain_type="stuff",
            retriever=vector_db.as_retriever(search_kwargs={"k": 4}),
            chain_type_kwargs={"prompt": prompt},
            return_source_documents=False
        )

        # Get answer
        result = qa_chain.invoke({"query": question})
        return remove_think_blocks(result["result"])
    except Exception as e:
        return f"Error processing query: {str(e)}"

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python rag.py <filename> <question>")
        sys.exit(1)
    
    filename = sys.argv[1]
    question = sys.argv[2]
    answer = query_document(question, filename)
    print(answer)