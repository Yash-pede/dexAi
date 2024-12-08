import { useQuery } from "@tanstack/react-query";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";
import { useNavigate } from "react-router";

const Messages = ({ children }: { children?: React.ReactNode }) => {
  const navigarion = useNavigate();
  const { data: messages, isLoading: isLoadingMessages } = useQuery({
    queryKey: ["messages"],
    queryFn: async () => {
      const baseUrl = import.meta.env.VITE_BASE_BACKEND_URL || "";
      const response = await axios.get(`${baseUrl}/api/messages/list`);
      return response.data.messages;
    },
  });
  return (
    <>
      <div className="w-full flex flex-col gap-4 mt-5">
        <h1 className="text-3xl font-bold tracking-wider">Messages</h1>
        <Separator />
        <div className="flex w-full gap-5 flex-col items-center ">
          {isLoadingMessages ? (
            Array.from({ length: 5 }).map((_, idx) => (
              <Skeleton key={idx} className="w-full h-20" />
            ))
          ) : messages && messages.length > 0 ? (
            messages.map(
              (
                message: {
                  message_link: string;
                  img_url: string | undefined;
                  company_name: string;
                  sender_name: string;
                  date: string;
                  message_text: string;
                },
                idx: number
              ) => (
                <Card
                  key={idx}
                  className="w-full cursor-pointer"
                  onClick={() => {
                    navigarion(
                      `/messages/${message.message_link.split("/").pop()}`
                    );
                  }}
                >
                  <CardHeader className="flex gap-4 flex-row items-center">
                    <img
                      src={message.img_url}
                      className="w-12 h-12 rounded-md"
                      alt=""
                    />
                    <div className="">
                      <CardTitle>{message.company_name}</CardTitle>
                      <div className="flex gap-2 items-center">
                        <CardTitle className="text-lg">
                          {message.sender_name}{" "}
                        </CardTitle>
                        <CardDescription>{message.date}</CardDescription>
                      </div>
                      <CardDescription>{message.message_text}</CardDescription>
                    </div>
                  </CardHeader>
                </Card>
              )
            )
          ) : (
            <span className="text-lg text-muted-foreground font-semibold ">
              No messages
            </span>
          )}
        </div>
      </div>
      {children}
    </>
  );
};

export default Messages;
