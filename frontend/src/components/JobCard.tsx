import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { JobDataType } from "@/lib/types";
import { Building2, MoveDown } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
const JobCard = ({
  jobs,
  pageCount,
  setPageCount,
  pageLeft,
  loading,
}: {
  jobs: JobDataType[];
  pageCount: number;
  setPageCount: React.Dispatch<React.SetStateAction<number>>;
  pageLeft: boolean;
  loading: boolean;
}) => {
  return (
    <div className="flex w-full flex-col gap-4">
      {jobs.map((data, idx) => (
        <Card key={idx} className="w-full">
          <CardHeader className="flex flex-row items-center gap-4">
            <Building2 className="h-10 w-10" />
            <div className="flex flex-col gap-[0.15rem]">
              <CardTitle>{data.job_title}</CardTitle>
              <CardDescription className="text-foreground">
                {data.company_description}
              </CardDescription>
              <CardDescription>{data.company_size}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {data.additional_details.map((item, idx) => (
              <div
                className="flex flex-row justify-between items-center"
                key={idx}
              >
                <div className="flex flex-col w-full items-start justify-between">
                  <div className="flex items-center">
                    <span className="font-bold text-primary text-lg">
                      {item.job_description}
                    </span>
                    <Badge className="ml-2" variant="secondary">
                      {item.job_type}
                    </Badge>
                  </div>
                  <p className="">
                    {item.job_details
                      .map((detail) => detail.replace(/\+/g, " + "))
                      .join(" | ")}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline">Save</Button>
                  <a
                    href={"https://wellfound.com" + item.job_link}
                    target="_blank"
                  >
                    <Button>Apply</Button>
                  </a>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
      {loading && <Skeleton className="w-full h-40" />}
      <div hidden={!pageLeft} className="w-full grid place-items-center">
        <Button onClick={() => setPageCount(pageCount + 1)}>
          <MoveDown /> Load more
        </Button>
      </div>
    </div>
  );
};

export default JobCard;
