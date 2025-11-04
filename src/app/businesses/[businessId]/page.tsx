type BusinessPageProps = {
    params: Promise<{
        businessId: string;
    }>;
};

const BusinessPage = async ({ params }: BusinessPageProps) => {
    const { businessId } = await params;

    return <h1 className="text-xl">BusinessPage: {businessId}</h1>;
}

export default BusinessPage;