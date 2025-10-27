
import React from "react";
import { useRouter } from "next/navigation";


const ListContainer = () => {
    const router = useRouter();

    var myJson = [

        {
            "id": 1,
            "title": "baskent",
            "SoruSırası": "1."
        },
        {
            "id": 2,
            "title": "Tokyo",
            "SoruSırası": "2."
        }, {
            "id": 3,
            "title": "baskent",
            "SoruSırası": "1."
        },
        {
            "id": 4,
            "title": "Tokyo",
            "SoruSırası": "2."
        }, {
            "id": 5,
            "title": "baskent",
            "SoruSırası": "1."
        },
        {
            "id": 6,
            "title": "Tokyo",
            "SoruSırası": "2."
        },
        {
            "id": 3,
            "title": "baskent",
            "SoruSırası": "1."
        },
        {
            "id": 4,
            "title": "Tokyo",
            "SoruSırası": "2."
        }, {
            "id": 5,
            "title": "baskent",
            "SoruSırası": "1."
        },
        {
            "id": 6,
            "title": "Tokyo",
            "SoruSırası": "2."
        },
        {
            "id": 3,
            "title": "baskent",
            "SoruSırası": "1."
        },
        {
            "id": 4,
            "title": "Tokyo",
            "SoruSırası": "2."
        }, {
            "id": 5,
            "title": "baskent",
            "SoruSırası": "1."
        },
        {
            "id": 6,
            "title": "Tokyo",
            "SoruSırası": "2."
        },
        {
            "id": 3,
            "title": "baskent",
            "SoruSırası": "1."
        },
        {
            "id": 4,
            "title": "Tokyo",
            "SoruSırası": "2."
        }, {
            "id": 5,
            "title": "baskent",
            "SoruSırası": "1."
        },
        {
            "id": 6,
            "title": "Tokyo",
            "SoruSırası": "2."
        },
        {
            "id": 3,
            "title": "baskent",
            "SoruSırası": "1."
        },
        {
            "id": 4,
            "title": "Tokyo",
            "SoruSırası": "2."
        }, {
            "id": 5,
            "title": "baskent",
            "SoruSırası": "1."
        },
        {
            "id": 6,
            "title": "Tokyo",
            "SoruSırası": "2."
        }
    ];

    const handleStart = (id: number) => {
        router.replace(`/admin/quiz/join/${id}`);
    };


    return (
        <>
            <div className="p-6 w-full grid grid-cols-3 grid-rows-auto overflow-y-auto gap-2 ">
                {myJson.map((quiz) => (
                    <div
                        key={quiz.id}
                        className="flex justify-between bg-white rounded-lg p-4 shadow w-75 h-20"
                    >
                        <div>
                            <h2 className="text-lg font-semibold">{quiz.title}</h2>
                            <p className="text-sm text-gray-500">{quiz.SoruSırası} soru</p>
                        </div>
                        <button
                            onClick={() => handleStart(quiz.id)}
                            className="bg-[#BB0000] text-white px-6 py-3 rounded-lg hover:bg-[#BB0000] transition"
                        >
                            Başlat
                        </button>
                    </div>
                ))}
            </div>
        </>
    );
};

export default ListContainer;
