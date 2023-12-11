let affordabilityChart;

document.addEventListener("DOMContentLoaded", function () {
    const tabs = document.querySelectorAll("nav ul li a");
    const sections = document.querySelectorAll("main section");

    tabs.forEach((tab) => {
        tab.addEventListener("click", function (event) {
            event.preventDefault();

            // Hide all sections
            sections.forEach((section) => {
                section.style.display = "none";
            });

            // Show the corresponding section
            const targetId = this.getAttribute("href").substring(1);
            document.getElementById(targetId).style.display = "block";

            // Remove active class from all tabs
            tabs.forEach((tab) => {
                tab.parentElement.classList.remove("active");
            });

            // Add active class to the clicked tab
            this.parentElement.classList.add("active");
        });
    });

    // Show the default section (e.g., compare)
    document.getElementById("compare").style.display = "block";

    // Get input and slider elements
    const monthlyAffordabilityInput = document.getElementById("monthly-affordability");
    const affordabilitySlider = document.getElementById("affordability-slider");
    const estimatedMortgageText = document.getElementById("estimated-mortgage");

    // Function to update input value based on slider
    function updateInput() {
        monthlyAffordabilityInput.value = affordabilitySlider.value;
        calculateMortgage(); // Recalculate when the slider changes
    }

    // Function to calculate estimated mortgage amount
    function calculateMortgage() {
        const monthlyAffordability = parseFloat(monthlyAffordabilityInput.value);
        // Typical mortgage terms (adjust as needed)
        const interestRate = 0.04; // 4% annual interest rate
        const loanTermYears = 30; // 30-year loan term

        // Calculate estimated mortgage amount
        const monthlyInterestRate = interestRate / 12;
        const loanTermMonths = loanTermYears * 12;
        const estimatedMortgage = (monthlyAffordability / monthlyInterestRate) *
            (1 - Math.pow(1 + monthlyInterestRate, -loanTermMonths));

        // Update the estimated mortgage input field as text
        estimatedMortgageText.textContent = `Estimated Mortgage Amount: $${estimatedMortgage.toFixed(2)}`;
        updateAffordabilityChart(monthlyAffordability, estimatedMortgage);
    }

    // Create a function to update the affordability chart
    function updateAffordabilityChart(monthlyAffordability, estimatedMortgage) {
        const ctx = document.getElementById("affordability-chart").getContext("2d");

        // Check if the chart instance already exists
        if (affordabilityChart) {
            // Destroy the existing chart before creating a new one
            affordabilityChart.destroy();
        }

        // Define the data for the chart
        const data = {
            labels: ["User Input"],
            datasets: [
                {
                    label: "Affordability vs. Borrowing",
                    data: [{ x: monthlyAffordability, y: estimatedMortgage }],
                    pointBackgroundColor: "blue", // Color of the data point
                },
            ],
        };

        // Define the options for the chart
        const options = {
            scales: {
                x: {
                    type: "linear",
                    position: "bottom",
                    title: {
                        display: true,
                        text: "Monthly Affordability",
                    },
                    min: 0, // Minimum value for the x-axis
                    max: 12000, // Maximum value for the x-axis
                },
                y: {
                    type: "linear",
                    position: "left",
                    title: {
                        display: true,
                        text: "Borrowing Amount",
                    },
                    min: 0, // Minimum value for the y-axis
                    max: 2500000, // Maximum value for the y-axis
                },
            },
            plugins: {
                annotation: {
                    annotations: [
                        {
                            type: "line",
                            mode: "vertical",
                            scaleID: "x",
                            value: monthlyAffordability,
                            borderColor: "red",
                            borderWidth: 1,
                            label: {
                                content: `Monthly Affordability: $${monthlyAffordability.toFixed(2)}`,
                                enabled: true,
                                position: "top",
                            },
                        },
                        {
                            type: "line",
                            mode: "horizontal",
                            scaleID: "y",
                            value: estimatedMortgage,
                            borderColor: "green",
                            borderWidth: 1,
                            label: {
                                content: `Borrowing Amount: $${estimatedMortgage.toFixed(2)}`,
                                enabled: true,
                                position: "right",
                            },
                        },
                    ],
                },
            },
        };

        // Create the chart
        affordabilityChart = new Chart(ctx, {
            type: "scatter", // Use scatter plot type
            data: data,
            options: Object.assign(options, {
                responsive: false, // Disable responsiveness
                maintainAspectRatio: false, // Disable aspect ratio maintenance
                width: 1200, // Set the width
                height: 600, // Set the height
            }),        });
    }

    // Add event listeners for input and slider changes
    monthlyAffordabilityInput.addEventListener("input", updateInput);
    affordabilitySlider.addEventListener("input", updateInput);

    // Initialize the mortgage calculation
    calculateMortgage();
});
