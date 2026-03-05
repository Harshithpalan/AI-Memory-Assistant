import time
print("Granular AI Engine Check...")
s = time.time()

print("a. importing langchain_google_genai...")
import langchain_google_genai
print(f"   Done in {time.time()-s:.2f}s")

print("b. importing ChatGoogleGenerativeAI...")
from langchain_google_genai import ChatGoogleGenerativeAI
print(f"   Done in {time.time()-s:.2f}s")

print("c. instantiating ChatGoogleGenerativeAI...")
llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", google_api_key="TEST")
print(f"   Done in {time.time()-s:.2f}s")
