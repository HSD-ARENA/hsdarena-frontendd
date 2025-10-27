"use client";

import { FC } from "react";

interface QuestionCardProps {
    text: string;
    options: string[];
    correct?: string; // admin tarafı için cevabı gösterebilir
    showAnswer?: boolean;
    onSelectOption?: (option: string) => void; // takım tarafı için
    selectedOption?: string;
}

const QuestionCard: FC<QuestionCardProps> = ({
    text,
    options,
    correct,
    showAnswer = false,
    onSelectOption,
    selectedOption
}) => {
    return (
        <div className="bg-white p-4 rounded shadow space-y-2">
            <p className="font-semibold">{text}</p>
            <ul className="list-disc pl-6">
                {options.map(opt => (
                    <li key={opt}>
                        {onSelectOption ? (
                            <label className="cursor-pointer">
                                <input
                                    type="radio"
                                    name="answer"
                                    value={opt}
                                    checked={selectedOption === opt}
                                    onChange={() => onSelectOption(opt)}
                                    className="mr-2"
                                />
                                {opt}
                            </label>
                        ) : (
                            <span
                                className={showAnswer && correct === opt ? "font-bold text-green-600" : ""}
                            >
                                {opt}
                            </span>
                        )}
                    </li>
                ))}
            </ul>
            {showAnswer && correct && (
                <p className="mt-2 font-bold text-green-600">Doğru Cevap: {correct}</p>
            )}
        </div>
    );
};

export default QuestionCard;
