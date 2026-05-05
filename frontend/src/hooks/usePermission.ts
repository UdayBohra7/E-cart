import { useUser } from "@/lib/auth";

export const usePermission = () => {
    const { data: user } = useUser();

    const hasPermission = (module: string, action: string = "index") => {
        if (!user) return false;
        
        const access_rights = user?.data?.access_rights;
        
        if (user?.role === 'admin' && !access_rights) return true;
        if (!access_rights) return false;

        const rights = access_rights[module as keyof typeof access_rights];
        if (!rights) return false;

        return rights.includes("all") || rights.includes(action);
    };

    return { hasPermission };
};
