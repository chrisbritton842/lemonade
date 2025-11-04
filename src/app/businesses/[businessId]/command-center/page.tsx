type CommandCenterPageProps = {
    params: Promise<{
        businessId: string;
    }>;
};

const CommandCenterPage = async ({ params }: CommandCenterPageProps) => {
    const { businessId } = await params;

    return <h2 className="text-lg">CommandCenterPage: {businessId}</h2>;
};

export default CommandCenterPage;