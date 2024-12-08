import { useNavigate, useParams } from "react-router";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetClose,
  SheetFooter,
} from "@/components/ui/sheet";
import Messages from "./Messages";
import {
  ArrowBigLeft,
  BriefcaseBusiness,
  Building2,
  MessageCircle,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "../ui/card";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";

const Conversation = () => {
  const { messageid } = useParams();
  const navigate = useNavigate();
  const [sender, setSender] = useState("");
  const [inputValue, setInputValue] = useState("");

  const {
    data: conversation,
    isLoading: isLoadingConversation,
    refetch: refetchConversation,
    isRefetching: isRefetchingConversation,
    isError: isError,
  } = useQuery({
    queryKey: ["conversation"],
    queryFn: async () => {
      const baseUrl = import.meta.env.VITE_BASE_BACKEND_URL || "";
      const response = await axios.get(
        `${baseUrl}/api/messages/conversation/${messageid}`
      );
      setSender(response.data.messages[1].sender);
      return response.data;
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: async () => {
      const baseUrl = import.meta.env.VITE_BASE_BACKEND_URL || "";
      const response = await axios.post(
        `${baseUrl}/api/messages/send`,
        {
          messageid: messageid,
          message: inputValue,
        }
      );
      return response.data;
    },
    onSuccess() {
      setInputValue("");
      refetchConversation();
    },
    onError(error) {
      console.log(error);
      refetchConversation();
    },
  });

  if (!conversation || isLoadingConversation || isRefetchingConversation) {
    return Array.from({ length: 5 }).map((_, idx) => (
      <Skeleton key={idx} className="w-full h-10" />
    ));
  }
  if (isError)
    return (
      <div className="flex justify-center items-center h-full w-full">
        Error
      </div>
    );
  return (
    <Messages>
      <Sheet open={!!messageid}>
        <SheetContent className="min-w-[50%]">
          <SheetClose
            onClick={() => navigate("/messages")}
            className="flex gap-2 items-center"
          >
            <ArrowBigLeft className="mr-2" /> Back
          </SheetClose>
          <SheetHeader className="flex gap-4 my-4 flex-row items-center">
            <img
              src={conversation.company_info.logo}
              className="w-10 h-10 rounded-md"
              alt={conversation.company_info.name}
            />
            <div className="flex flex-col gap-1">
              <CardTitle>{conversation.company_info.name}</CardTitle>
              <CardDescription>
                {conversation.company_info.description}
              </CardDescription>
            </div>
          </SheetHeader>
          <Tabs defaultValue="messages" className="w-full mt-5 h-2/3">
            <TabsList className="w-full">
              <TabsTrigger className="w-full" value="messages">
                <MessageCircle className="mr-2" /> messages
              </TabsTrigger>
              <TabsTrigger className="w-full" value="job">
                <BriefcaseBusiness className="mr-2" /> Job description
              </TabsTrigger>
              <TabsTrigger className="w-full" value="company">
                <Building2 className="mr-2" /> Company info
              </TabsTrigger>
            </TabsList>
            <TabsContent
              value="messages"
              className="flex gap-2 flex-col h-5/6 overflow-auto my-5"
            >
              {isLoadingConversation ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <Skeleton key={idx} className="w-full h-20" />
                ))
              ) : conversation && conversation.messages.length > 0 ? (
                conversation.messages.map((message :any, idx: number) => {
                  console.log(message.sender);
                  return (
                    <div
                      className={`flex w-full ${
                        message.sender === sender ? "flex-row-reverse" : ""
                      }`}
                      key={idx}
                    >
                      <Card
                        className={`mx-4 max-w-md ${
                          message.sender === sender
                            ? "bg-gray-100"
                            : "bg-primary text-white"
                        }`}
                      >
                        <CardContent className="p-2">
                          {message.message}
                        </CardContent>
                      </Card>
                    </div>
                  );
                })
              ) : (
                <span className="text-muted-foreground text-sm">
                  No messages
                </span>
              )}
            </TabsContent>
            <TabsContent value="job">Job</TabsContent>
            <TabsContent value="company">Company</TabsContent>
          </Tabs>
          <SheetFooter className="">
            <div className="grid w-full gap-1.5">
              <Label htmlFor="message-2">Your Message</Label>
              <Textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message here."
                id="message-2"
              />
              <div className="flex justify-between">
                <p className="text-sm text-muted-foreground">
                  Send message to{" "}
                  <span className="font-semibold">
                    {conversation.company_info.name}
                  </span>
                </p>
                <Button size="sm" onClick={()=> sendMessageMutation.mutate()}>
                  Send
                </Button>
              </div>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </Messages>
  );
};

export default Conversation;
