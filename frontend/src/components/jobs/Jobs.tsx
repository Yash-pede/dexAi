import React, { useEffect } from "react";
import { Button } from "../ui/button";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import CommandPopover from "../CommandPopover";
import { Skeleton } from "../ui/skeleton";
import { JobDataType } from "@/lib/types";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import JobCard from "../JobCard";

const Jobs = () => {
  const baseUrl = import.meta.env.VITE_BASE_BACKEND_URL || "";
  const [selectedRole, setSelectedRole] = React.useState<string>("");
  const [selectedLocation, setSelectedLocation] = React.useState<string>("");
  const [pageCount, setPageCount] = React.useState<number>(1);
  const [jobsData, setJobsData] = React.useState<JobDataType[]>([]);

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
      const response = await axios.get(`${baseUrl}/api/jobs/locations`);
      return response.data;
    },
  });

  const {
    data: Jobs,
    isLoading: isLoadingJobs,
    refetch: refetchJobs,
    isRefetching: isRefetchingJobs,
  } = useQuery<{
    page_left: number;
    data: JobDataType[];
  }>({
    queryKey: ["jobs"],
    queryFn: async () => {
      if (
        Locations?.find((l) => l.value === selectedLocation) &&
        Roles?.find((r) => r.value === selectedRole)
      ) {
        const response = await axios.get(
          `${baseUrl}/api/jobs/results/${selectedLocation}/${selectedRole}?page=${pageCount}`
        );
        setJobsData([...jobsData, ...response.data.data]);
        return response.data;
      }
      return [];
    },
    enabled: false,
  });

  useEffect(() => {
    refetchJobs();
  }, [pageCount]);

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
              {" "}
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
            loading={isLoadingJobs || isRefetchingJobs}
            pageLeft={Jobs && Jobs?.page_left > 0 ? true : false}
            jobs={jobsData}
            pageCount={pageCount}
            setPageCount={setPageCount}
          />
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
