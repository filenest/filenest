"use client"

export default function Home() {
    function testApi() {
        fetch("/api/media/getAssets", { method: "POST" })
            .then((res) => res.json())
            .then((data) => console.log(data))
    }

    return (
        <main>
            <h1>Home</h1>
            <button onClick={testApi}>Test API</button>
        </main>
    )
}
