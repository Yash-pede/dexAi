import React from "react";
import { Button } from "../ui/button";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import CommandPopover from "../CommandPopover";
import { Skeleton } from "../ui/skeleton";
import { JobDataType } from "@/lib/types";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import JobCard from "../JobCard";
import { Loader } from "lucide-react";

const Jobs = () => {
  const baseUrl = import.meta.env.VITE_BASE_BACKEND_URL || "";
  const [selectedRole, setSelectedRole] = React.useState<string>("");
  const [selectedLocation, setSelectedLocation] = React.useState<string>("");
  const [jobsData, setJobsData] = React.useState<
    {
      location: string;
      role: string;
      pageCount: number;
      pageLeft: boolean;
      data: JobDataType[];
    }[]
  >([]);

  const { data: Roles, isLoading: isLoadingRoles } = useQuery<
    { label: string; value: string }[]
  >({
    queryKey: ["roles"],
    queryFn: async () => {
      const response = await axios.get(`${baseUrl}/api/jobs/roles`);
      return response.data;
    },
  });
  const { data: Locations, isLoading: isLoadingLocations } = useQuery<
    { label: string; value: string }[]
  >({
    queryKey: ["locations"],
    queryFn: async () => {
      const response = await axios.get(`${baseUrl}/api/jobs/locations`, {
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
      });
      return response.data;
    },
  });

  const {
    isLoading: isLoadingJobs,
    refetch: refetchJobs,
    isRefetching: isRefetchingJobs,
    isError: isErrorJobs,
  } = useQuery<{
    page_left: number;
    data: JobDataType[];
  }>({
    queryKey: ["jobs", selectedLocation, selectedRole],
    queryFn: async () => {
      const currentEntry = jobsData.find(
        (j) => j.location === selectedLocation && j.role === selectedRole
      );

      const currentPage = currentEntry ? currentEntry.pageCount : 1;

      const response = await axios.get(
        `${baseUrl}/api/jobs/results/${selectedLocation}/${selectedRole}?page=${currentPage}`
      );

      setJobsData((prev) => {
        const existingEntry = prev.find(
          (j) => j.location === selectedLocation && j.role === selectedRole
        );

        if (existingEntry) {
          return prev.map((j) => {
            if (j.location === selectedLocation && j.role === selectedRole) {
              return {
                ...j,
                data: [...j.data, ...response.data.data],
                pageCount: j.pageCount + 1,
                pageLeft: response.data.page_left,
              };
            }
            return j;
          });
        } else {
          return [
            ...prev,
            {
              location: selectedLocation,
              role: selectedRole,
              pageCount: 2,
              data: response.data.data,
              pageLeft: response.data.page_left,
            },
          ];
        }
      });

      return response.data;
    },
    enabled: false,
  });

  return (
    <div className="w-full gap-8 flex flex-col">
      <Card className="w-full border-none">
        <CardHeader>
          <CardTitle className="text-2xl flex justify-evenly gap-4 items-center tracking-wider">
            Show me{" "}
            <CommandPopover
              placeholder="Select Role..."
              width="w-[300px]"
              data={Roles}
              isLoading={isLoadingRoles}
              value={selectedRole}
              setValue={setSelectedRole}
            />
            roles, Hiring in
            <CommandPopover
              placeholder="Select Location..."
              width="w-[300px]"
              data={Locations}
              isLoading={isLoadingLocations}
              value={selectedLocation}
              setValue={setSelectedLocation}
            />
            <Button
              disabled={
                isLoadingJobs || selectedLocation === "" || selectedRole === ""
              }
              onClick={() => refetchJobs()}
            >
              <Loader
                className={`mr-2 h-4 w-4 animate-spin ${
                  isLoadingJobs || isRefetchingJobs ? "" : "hidden"
                }`}
              />
              Search
            </Button>
          </CardTitle>
        </CardHeader>
      </Card>
      <div className="flex gap-4 flex-wrap">
        {(isLoadingJobs || isRefetchingJobs) && jobsData.length === 0 ? (
          Array.from({ length: 10 }).map((_, index) => (
            <Skeleton key={index} className="w-full h-40" />
          ))
        ) : jobsData.length > 0 ? (
          <JobCard
            fetchNextPage={refetchJobs}
            loading={isLoadingJobs || isRefetchingJobs}
            pageLeft={
              jobsData.find((j) => j.location === selectedLocation)?.pageLeft
                ? true
                : false
            }
            jobs={
              jobsData.find(
                (j) =>
                  j.location === selectedLocation && j.role === selectedRole
              )?.data || []
            }
            pageCount={
              jobsData.find(
                (j) =>
                  j.location === selectedLocation && j.role === selectedRole
              )?.pageCount || 1
            }
          />
        ) : isErrorJobs ? (
          <div className="w-full h-[60vh] grid place-items-center">
            <p className="text-xl text-red-500 text-muted-foreground font-light">
              <span>😕</span> Something went wrong
            </p>
          </div>
        ) : (
          <div className="w-full h-[60vh] grid place-items-center">
            <p className="text-xl text-muted-foreground font-light">
              No Jobs Found
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;
