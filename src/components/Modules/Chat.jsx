// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import { Button } from "../ui/Button";
// import { Send } from "lucide-react";
// import { Toaster, toast } from "sonner";

// const Chat = () => {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const messagesEndRef = useRef(null);
//   const controllerRef = useRef(null);
//   const responseText = useRef("");

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   useEffect(() => {
//     // Cleanup abort controller on unmount
//     return () => {
//       if (controllerRef.current) {
//         controllerRef.current.abort();
//       }
//     };
//   }, []);

//   const handleSendMessage = async () => {
//     if (input.trim() === "") return;
    
//     const userMessage = { role: "user", content: input };
//     setMessages(prev => [...prev, userMessage]);
//     setInput("");
//     setIsLoading(true);

//     try {
//       // Create new abort controller for this request
//       controllerRef.current = new AbortController();
//       responseText.current = "";
      
//       // Add assistant message placeholder
//       setMessages(prev => [...prev, { role: "assistant", content: "" }]);

//       const response = await fetch('http://localhost:8001/chat', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         },
//         body: JSON.stringify({ question: input }),
//         signal: controllerRef.current.signal
//       });

//       const reader = response.body.getReader();
//       const decoder = new TextDecoder();

//       while (true) {
//         const { done, value } = await reader.read();
//         if (done) break;

//         const chunk = decoder.decode(value, { stream: true });
//         responseText.current += chunk;

//         // Update only the assistant's message
//         setMessages(prev => {
//           const newMessages = [...prev];
//           const lastMessage = newMessages[newMessages.length - 1];
//           if (lastMessage.role === "assistant") {
//             return newMessages.map((msg, index) => 
//               index === newMessages.length - 1 
//                 ? { ...msg, content: responseText.current } 
//                 : msg
//             );
//           }
//           return newMessages;
//         });
//       }
//     } catch (error) {
//       if (error.name !== 'AbortError') {
//         toast.error("Failed to send message");
//         setMessages(prev => prev.filter(msg => msg.content !== ""));
//       }
//     } finally {
//       setIsLoading(false);
//       controllerRef.current = null;
//     }
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   return (
//     <div className="flex-1 bg-[#151515] text-white p-4">
//       <div className="w-full">
//         <div className="items-center pb-5 border-b border-gray-700">
//           <h1 className="text-2xl font-bold">DentalAi</h1>
//           <div className="text-gray-400 text-sm mt-1">Version 1.0.0</div>
//         </div>

//         <div className="h-[calc(100vh-200px)] overflow-y-auto py-4">
//           {messages.length === 0 ? (
//             <div className="h-full flex flex-col items-center justify-center space-y-4">
//               <div className="bg-[#202123] rounded-full p-4">
//                 <svg 
//                   xmlns="http://www.w3.org/2000/svg" 
//                   className="h-12 w-12 text-[#ff2c2c]" 
//                   fill="none" 
//                   viewBox="0 0 24 24" 
//                   stroke="currentColor"
//                 >
//                   <path 
//                     strokeLinecap="round" 
//                     strokeLinejoin="round" 
//                     strokeWidth={2} 
//                     d="M13 10V3L4 14h7v7l9-11h-7z" 
//                   />
//                 </svg>
//               </div>
//               <h2 className="text-2xl font-medium">Hi, I'm DentalAI</h2>
//               <p className="text-gray-400">How can I help you today?</p>
//             </div>
//           ) : (
//             <div className="max-w-3xl mx-auto space-y-6">
//               {messages.map((message, index) => (
//                 <div
//                   key={index}
//                   className={`flex ${
//                     message.role === "user" ? "justify-end" : "justify-start"
//                   }`}
//                 >
//                   <div
//                     className={`max-w-[80%] p-3 rounded-xl ${
//                       message.role === "user"
//                         ? "bg-[#6366f1] text-white"
//                         : "bg-[#202123] text-white"
//                     }`}
//                   >
//                     {message.content}
//                     {isLoading && index === messages.length - 1 && (
//                       <span className="inline-flex items-center">
//                         <span className="animate-spin inline-block w-4 h-4 border-[2px] border-current border-t-transparent text-white rounded-full"/>
//                         <span className="text-sm ml-3 animate-pulse">Thinking...</span>
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//           <div ref={messagesEndRef} />
//         </div>

//         <div className="border-t border-gray-700 pt-4">
//           <div className="max-w-3xl mx-auto flex items-center gap-2">
//             <input
//               type="text"
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onKeyDown={handleKeyDown}
//               placeholder="Message DentalAi"
//               className="flex-1 bg-[#202123] text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#ffffff]"
//               disabled={isLoading}
//             />
//             <Button
//               onClick={handleSendMessage}
//               disabled={isLoading || input.trim() === ""}
//               className="bg-[#000000] text-white hover:bg-[#ffffff] hover:text-black px-4 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
//             >
//               <Send size={20} className="w-5 h-5" />
//             </Button>
//           </div>
//         </div>
//       </div>
//       <Toaster richColors visibleToasts={1} position="bottom-center" />
//     </div>
//   );
// };

// export default Chat;



import React, { useState, useEffect, useRef } from "react";
import { Button } from "../ui/Button";
import { Toaster, toast } from "sonner";

const Chat = () => {
  const [descriptionInput, setDescriptionInput] = useState("");
  const [cdtInput, setCdtInput] = useState("");
  const [descriptionResponse, setDescriptionResponse] = useState("");
  const [cdtResponse, setCdtResponse] = useState("");
  const [isLoadingDescription, setIsLoadingDescription] = useState(false);
  const [isLoadingCdt, setIsLoadingCdt] = useState(false);
  const controllerRef = useRef(null);
  const descriptionTimeoutRef = useRef(null);
  const cdtTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
      if (descriptionTimeoutRef.current) {
        clearTimeout(descriptionTimeoutRef.current);
      }
      if (cdtTimeoutRef.current) {
        clearTimeout(cdtTimeoutRef.current);
      }
    };
  }, []);

  
  useEffect(() => {
    if (descriptionInput.trim() === "") {
      return;
    }
    
    if (descriptionTimeoutRef.current) {
      clearTimeout(descriptionTimeoutRef.current);
    }
    
    descriptionTimeoutRef.current = setTimeout(() => {
      handleSendMessage("description", descriptionInput);
    }, 500);
    
    return () => {
      if (descriptionTimeoutRef.current) {
        clearTimeout(descriptionTimeoutRef.current);
      }
    };
  }, [descriptionInput]);

 
  useEffect(() => {
    if (cdtInput.trim() === "") {
      return;
    }
    
    if (cdtTimeoutRef.current) {
      clearTimeout(cdtTimeoutRef.current);
    }
    
    cdtTimeoutRef.current = setTimeout(() => {
      handleSendMessage("cdt", cdtInput);
    }, 500);
    
    return () => {
      if (cdtTimeoutRef.current) {
        clearTimeout(cdtTimeoutRef.current);
      }
    };
  }, [cdtInput]);

  const handleSendMessage = async (source, message) => {
    if (message.trim() === "") return;
    
    const isDescriptionSource = source === "description";
    
  
    if ((isDescriptionSource && isLoadingDescription) || 
        (!isDescriptionSource && isLoadingCdt)) {
      return;
    }
    
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
    
    if (isDescriptionSource) {
      setIsLoadingDescription(true);
      setCdtResponse(""); 
    } else {
      setIsLoadingCdt(true);
      setDescriptionResponse(""); 
    }

    try {
      controllerRef.current = new AbortController();
      let fullResponse = "";
      
      const response = await fetch('http://localhost:8001/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ 
          question:message,
          // source 
        }),
        signal: controllerRef.current.signal
      });

        if (!response.ok) {
          if (response.status === 401) {
            toast.error("Session expired. Logging out...");
            localStorage.removeItem("token"); 
            setTimeout(() => {
              window.location.href = "/login";
            }, 1500);
          }
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        fullResponse += chunk;
        const rr = JSON.parse(fullResponse)
        // console.log(rr)
        // console.log(fullResponse.code)
       
        if (isDescriptionSource) {
          setCdtResponse(rr.code);
        } else {
          setDescriptionResponse(rr.description);
        }
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error("API error:", error);
        toast.error("Failed to get response");
      }
    } finally {
    
      if (isDescriptionSource) {
        setIsLoadingDescription(false);
      } else {
        setIsLoadingCdt(false);
      }
      controllerRef.current = null;
    }
  };

  useEffect(() => {
    if (descriptionInput !== "") {
      setDescriptionResponse(""); 
    }
  }, [descriptionInput]);
  
  useEffect(() => {
    if (cdtInput !== "") {
      setCdtResponse(""); 
    }
  }, [cdtInput]);



  return (
    <div className="flex-1 bg-[#151515] text-white min-h-screen flex flex-col">
      <div className="w-full max-w-6xl mx-auto p-4 flex-1 flex flex-col">
        <div className="flex-1 flex flex-col justify-center my-5">
          <div className="grid grid-cols-2 gap-8">
          
            <div className="bg-[#202123] rounded-xl p-4 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-lg font-medium">Description</h1>
                <Button
                  onClick={() => {
                    setDescriptionInput("");
                    setDescriptionResponse("");
                  }}
                  className="text-sm text-gray-400 hover:text-white"
                  variant="ghost"
                >
                  Clear
                </Button>
              </div>
              <textarea
                value={descriptionResponse || descriptionInput}
                onChange={(e) => setDescriptionInput(e.target.value)} 
                placeholder="Type or view description"
                className="h-40 bg-transparent text-white resize-none focus:outline-none text-xl p-4"
                disabled={isLoadingCdt}
              />
              {isLoadingCdt && (
                <div className="flex items-center gap-2 text-gray-400 mt-2">
                  <span className="animate-spin inline-block w-4 h-4 border-[2px] border-current border-t-transparent rounded-full"/>
                  <span>Generating description...</span>
                </div>
              )}
            </div>

            <div className="bg-[#202123] rounded-xl p-4 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-lg font-medium">CDT Code</h1>
                <Button
                  onClick={() => {
                    setCdtInput("");
                    setCdtResponse("");
                  }}
                  className="text-sm text-gray-400 hover:text-white"
                  variant="ghost"
                >
                  Clear
                </Button>
              </div>
              <textarea
                value={cdtResponse || cdtInput}
                onChange={(e) => setCdtInput(e.target.value)}
                placeholder="Type or view CDT code"
                className="h-40 bg-transparent text-white resize-none focus:outline-none text-xl p-4"
                disabled={isLoadingDescription}
              />
              {isLoadingDescription && (
                <div className="flex items-center gap-2 text-gray-400 mt-2">
                  <span className="animate-spin inline-block w-4 h-4 border-[2px] border-current border-t-transparent rounded-full"/>
                  <span>Generating CDT code...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Toaster richColors visibleToasts={1} position="bottom-center" />
    </div>
  );
};

export default Chat;