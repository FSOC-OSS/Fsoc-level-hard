import React, { useState } from "react";
import Accordion from "./Accordion";
import SearchBar from "./SearchBar";
import ContactForm from "./ContactForm";
import OnboardingManager from '../utils/OnboardingManager'

const FAQPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const faqData = [
    {
      category: "Getting Started",
      questions: [
        {
          question: "How do I start a quiz?",
          answer: "To start a quiz, navigate to the quiz page and click on the 'Start Quiz' button.",
        },
        {
          question: "Can I pause a quiz?",
          answer: "Yes, you can pause a quiz by clicking the pause button on the quiz interface.",
        },
      ],
    },
    {
      category: "Taking Quizzes",
      questions: [
        {
          question: "How is my score calculated?",
          answer: "Your score is calculated based on the number of correct answers.",
        },
        {
          question: "What do the difficulty levels mean?",
          answer: "Difficulty levels indicate the complexity of the questions.",
        },
      ],
    },
  ];

  const filteredFAQs = faqData.map((category) => ({
    ...category,
    questions: category.questions.filter((q) =>
      q.question.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-6">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Frequently Asked Questions</h1>
        <SearchBar value={searchQuery} onChange={setSearchQuery} />

        {filteredFAQs.map((category) => (
          <div key={category.category} className="mb-8">
            <h2 className="text-2xl font-semibold text-purple-700 mb-4">{category.category}</h2>
            <div className="space-y-4">
              {category.questions.map((q, index) => (
                <Accordion key={index} question={q.question} answer={q.answer} />
              ))}
            </div>
          </div>
        ))}

        <div className="mt-12">
          <ContactForm />
        </div>
        <div className="mt-8 text-center">
          <button onClick={() => OnboardingManager.open()} className="px-4 py-2 rounded bg-purple-600 text-white">Replay Onboarding</button>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;