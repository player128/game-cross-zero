import Link from "next/link";

export function BottomLink({text, linkText, url} : {text: string; linkText: string; url: string;}) {
    return (
        <p className="text-sm text-primary/80">
            {text}{" "}
            <Link
                href={url}
                className="font-medium text-primary hover:underline"
            >
                {linkText}
            </Link>
        </p>
    );
}