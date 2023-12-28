const AboutPage = () => {
    const features = [
        "View all S3 buckets",
        "View contents of a bucket",
        "Preview contents of a file. (images and code files)",
        "Create a new bucket",
        "Upload files to a bucket",
        "Download files from a bucket",
        "Delete files from a bucket",
        "View bucket policy",
        "View bucket CORS rules",
        "Generate pre-signed URLs",
        "Drag and drop files from your computer to upload them to a S3 bucket."
    ];

    return (
        <div>
            <div className="py-4">
                <h2 className="text-2xl font-semibold">About Bucket Box</h2>
                <p className="text-muted-foreground text-sm mt-2">
                    Bucket Box is a simple Desktop app to manage your AWS S3 buckets. This app is built with React, TypeScript, React Query v5, Tailwind CSS, shadcn/ui and Tauri.
                    <br /> It uses AWS CLI V2 to interact with your S3 buckets.
                </p>
            </div>
            <div>
                <h2 className="text-2xl font-semibold">Features</h2>
                <ul className="text-muted-foreground text-sm mt-2">
                    {features.map((feature, index) => (
                        <li key={index}>
                            <input type="checkbox" checked className="mr-2" />
                            {feature}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default AboutPage;
