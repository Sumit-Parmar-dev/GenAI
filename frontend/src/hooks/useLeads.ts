import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";

export interface Lead {
    id: number;
    name: string;
    email: string;
    source: string;
    status: string;
    userId: number;
    company?: string;
    jobRole?: string;
    industry?: string;
    notes?: string;
    score?: number;
    createdAt: string;
    updatedAt: string;
}

export const useLeads = () => {
    const queryClient = useQueryClient();

    const getLeads = useQuery<Lead[]>({
        queryKey: ["leads"],
        queryFn: () => apiRequest("/leads"),
    });

    const createLeadMutation = useMutation({
        mutationFn: (newLead: Partial<Lead>) =>
            apiRequest("/leads", {
                method: "POST",
                body: JSON.stringify(newLead),
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["leads"] });
        },
    });

    return { getLeads, createLeadMutation };
};

export const useLead = (id: string) => {
    const queryClient = useQueryClient();

    const getLead = useQuery<Lead>({
        queryKey: ["lead", id],
        queryFn: () => apiRequest(`/leads/${id}`),
        enabled: !!id,
    });

    const updateLeadMutation = useMutation({
        mutationFn: (data: Partial<Lead>) =>
            apiRequest(`/leads/${id}`, {
                method: "PATCH",
                body: JSON.stringify(data),
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["lead", id] });
            queryClient.invalidateQueries({ queryKey: ["leads"] });
        },
    });

    return { getLead, updateLeadMutation };
};
