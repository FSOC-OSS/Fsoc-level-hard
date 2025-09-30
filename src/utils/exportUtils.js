import jsPDF from "jspdf";

export const exportToPDF = (score, totalQuestions, percentage) => {
  const doc = new jsPDF();

  doc.setFontSize(22);
  doc.text("🏆 Quiz Results 🏆", 105, 20, { align: "center" });

  doc.setFontSize(16);
  doc.text(`Score: ${score} / ${totalQuestions}`, 20, 50);
  doc.text(`Percentage: ${percentage}%`, 20, 60);
  doc.text(`Date: ${new Date().toLocaleString()}`, 20, 70);

  // Optional: Add more detailed breakdown
  doc.text(`Correct: ${score}`, 20, 90);
  doc.text(`Incorrect: ${totalQuestions - score}`, 20, 100);

  doc.save("quiz-results.pdf");
};

// Print scorecard
export const printScorecard = (score, totalQuestions, percentage) => {
  const printWindow = window.open("", "_blank");
  printWindow.document.write(`
    <html>
      <head>
        <title>Quiz Results</title>
      </head>
      <body style="font-family: sans-serif; text-align: center; padding: 50px;">
        <h1>🏆 Quiz Results 🏆</h1>
        <p><strong>Score:</strong> ${score} / ${totalQuestions}</p>
        <p><strong>Percentage:</strong> ${percentage}%</p>
        <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>Correct:</strong> ${score}</p>
        <p><strong>Incorrect:</strong> ${totalQuestions - score}</p>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.print();
};

// Export results as JSON
export const exportToJSON = (score, totalQuestions, percentage) => {
  const results = { score, totalQuestions, percentage };
  const blob = new Blob([JSON.stringify(results, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "quiz-results.json";
  link.click();

  URL.revokeObjectURL(url);
};

// Export results as CSV
export const exportToCSV = (score, totalQuestions, percentage) => {
  const csvContent = `Score,Total Questions,Percentage\n${score},${totalQuestions},${percentage}%`;
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "quiz-results.csv";
  link.click();

  URL.revokeObjectURL(url);
};

// Share results
export const shareResults = async (score, totalQuestions, percentage) => {
  const text = `🏆 I scored ${score}/${totalQuestions} (${percentage}%) in the quiz! Try it too!`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: "My Quiz Results",
        text,
        url: window.location.href, // share quiz link
      });
    } catch (err) {
      console.error("Error sharing:", err);
    }
  } else {
    alert("Sharing not supported on this browser. Copy the score: " + text);
  }
};
