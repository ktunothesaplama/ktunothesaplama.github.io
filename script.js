// DOM Elements - Theme Toggle
const themeToggleBtn = document.getElementById('themeToggle');
const htmlElement = document.documentElement;

// Check for saved theme preference or respect OS theme preference
function initializeTheme() {
    // Check if user has previously selected a theme
    const savedTheme = localStorage.getItem('ktuTheme');
    
    if (savedTheme) {
        // Apply saved theme
        if (savedTheme === 'dark') {
            htmlElement.classList.add('dark-theme');
            updateThemeIcons(true);
        }
    } else {
        // Check if user prefers dark mode at OS level
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (prefersDarkMode) {
            htmlElement.classList.add('dark-theme');
            updateThemeIcons(true);
            localStorage.setItem('ktuTheme', 'dark');
        } else {
            localStorage.setItem('ktuTheme', 'light');
        }
    }
}

// Update theme icons based on current theme
function updateThemeIcons(isDarkTheme) {
    const lightIcon = document.querySelector('.light-icon');
    const darkIcon = document.querySelector('.dark-icon');
    
    if (isDarkTheme) {
        lightIcon.style.display = 'inline';
        lightIcon.style.opacity = '1';
        darkIcon.style.display = 'none';
        darkIcon.style.opacity = '0';
    } else {
        lightIcon.style.display = 'none';
        lightIcon.style.opacity = '0';
        darkIcon.style.display = 'inline';
        darkIcon.style.opacity = '1';
    }
}

// Toggle theme event listener
themeToggleBtn.addEventListener('click', () => {
    const isDarkTheme = htmlElement.classList.toggle('dark-theme');
    
    // Update theme in localStorage
    localStorage.setItem('ktuTheme', isDarkTheme ? 'dark' : 'light');
    
    // Update theme icons
    updateThemeIcons(isDarkTheme);
});

// Initialize theme on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
});

// DOM Elements - Calculation Type Buttons
const straightCalcBtn = document.getElementById('straightCalcBtn');
const reverseCalcBtn = document.getElementById('reverseCalcBtn');
const straightCalculation = document.getElementById('straightCalculation');
const reverseCalculation = document.getElementById('reverseCalculation');

// DOM Elements - Straight Calculation
const classSizeRadios = document.getElementsByName('classSize');
const midtermGrade = document.getElementById('midtermGrade');
const classAverage = document.getElementById('classAverage');
const standardDeviation = document.getElementById('standardDeviation');
const finalGrade = document.getElementById('finalGrade');
const calculateGrade = document.getElementById('calculateGrade');
const letterGradeElement = document.getElementById('letterGrade');
const numericGradeElement = document.getElementById('numericGrade');
const gradeMessage = document.getElementById('gradeMessage');
const gradeResult = document.getElementById('gradeResult');

// DOM Elements - Reverse Calculation
const revClassSizeRadios = document.getElementsByName('revClassSize');
const revMidtermGrade = document.getElementById('revMidtermGrade');
const revClassAverage = document.getElementById('revClassAverage');
const revStandardDeviation = document.getElementById('revStandardDeviation');
const calculateReverse = document.getElementById('calculateReverse');
const aaGrade = document.getElementById('aaGrade');
const baGrade = document.getElementById('baGrade');
const bbGrade = document.getElementById('bbGrade');
const cbGrade = document.getElementById('cbGrade');
const ccGrade = document.getElementById('ccGrade');
const dcGrade = document.getElementById('dcGrade');
const ddGrade = document.getElementById('ddGrade');

// Toggle between calculation types
straightCalcBtn.addEventListener('click', () => {
    straightCalcBtn.classList.add('active');
    reverseCalcBtn.classList.remove('active');
    straightCalculation.style.display = 'block';
    reverseCalculation.style.display = 'none';
});

reverseCalcBtn.addEventListener('click', () => {
    reverseCalcBtn.classList.add('active');
    straightCalcBtn.classList.remove('active');
    reverseCalculation.style.display = 'block';
    straightCalculation.style.display = 'none';
});

// Helper function to get selected radio value
function getSelectedRadioValue(radioGroup) {
    for (const radio of radioGroup) {
        if (radio.checked) {
            return radio.value;
        }
    }
    return null;
}

// Calculate T-Score based on inputs
function calculateTScore(grade, average, stdDev) {
    if (stdDev === 0) return 50; // Avoid division by zero
    return 50 + 10 * ((grade - average) / stdDev);
}

// Get letter grade based on T-Score and class size
function getLetterGradeFromTScore(tScore, classSize, finalGrade = null) {
    // Fail condition: Final grade less than 45
    if (finalGrade !== null && finalGrade < 45) {
        return { letter: 'FF', coefficient: 0 };
    }

    // Different grade limits based on class size
    let gradeMap;
    
    if (classSize === 'small') { // Less than 10 students
        gradeMap = {
            'AA': 57, 'BA': 52, 'BB': 47, 'CB': 42, 
            'CC': 37, 'DC': 32, 'DD': 27, 'FD': 22, 'FF': 0
        };
    } else if (classSize === 'medium') { // 10-30 students
        gradeMap = {
            'AA': 62, 'BA': 57, 'BB': 52, 'CB': 47, 
            'CC': 42, 'DC': 37, 'DD': 32, 'FD': 27, 'FF': 0
        };
    } else { // More than 30 students
        gradeMap = {
            'AA': 67, 'BA': 62, 'BB': 57, 'CB': 52, 
            'CC': 47, 'DC': 42, 'DD': 37, 'FD': 32, 'FF': 0
        };
    }

    // Map letter grades to coefficients
    const coeffMap = {
        'AA': 4.0, 'BA': 3.5, 'BB': 3.0, 'CB': 2.5,
        'CC': 2.0, 'DC': 1.5, 'DD': 1.0, 'FD': 0.5, 'FF': 0.0
    };

    // Determine letter grade based on T-score
    for (const [letter, minScore] of Object.entries(gradeMap)) {
        if (tScore >= minScore) {
            return { letter, coefficient: coeffMap[letter] };
        }
    }

    // Default to FF if no match found
    return { letter: 'FF', coefficient: 0 };
}

// Calculate required final grade for a specific letter grade
function calculateRequiredFinalGrade(midterm, average, stdDev, targetTScore, classSize) {
    // To get a specific letter grade, we need to solve for final grade
    // formula: tScore = 50 + 10 * ((totalGrade - average) / stdDev)
    // totalGrade = (midterm * 0.4) + (final * 0.6)
    
    // Based on the formula above, we can rearrange to solve for finalGrade:
    // finalGrade = ((((tScore - 50) / 10) * stdDev) + average - (midterm * 0.4)) / 0.6
    
    const requiredAverage = (((targetTScore - 50) / 10) * stdDev) + parseFloat(average);
    const requiredFinal = (requiredAverage - (parseFloat(midterm) * 0.4)) / 0.6;
    
    return Math.max(Math.min(Math.ceil(requiredFinal), 100), 0); // Ceiling the value and limit to 0-100 range
}

// Straight Calculation Event Handler
calculateGrade.addEventListener('click', () => {
    // Get input values
    const midtermVal = parseFloat(midtermGrade.value);
    const finalVal = parseFloat(finalGrade.value);
    const averageVal = parseFloat(classAverage.value);
    const stdDevVal = parseFloat(standardDeviation.value);
    const classSizeVal = getSelectedRadioValue(classSizeRadios);
    
    // Validation
    if (isNaN(midtermVal) || isNaN(finalVal) || isNaN(averageVal) || isNaN(stdDevVal)) {
        alert('Lütfen tüm alanları doldurun.');
        return;
    }
    
    if (midtermVal < 0 || midtermVal > 100 || finalVal < 0 || finalVal > 100 || 
        averageVal < 0 || averageVal > 100 || stdDevVal < 0) {
        alert('Lütfen geçerli değerler girin (0-100 arası notlar).');
        return;
    }
    
    // Calculate total grade (40% midterm, 60% final)
    const totalGrade = (midtermVal * 0.4) + (finalVal * 0.6);
    
    // Calculate T-Score
    const tScore = calculateTScore(totalGrade, averageVal, stdDevVal);
    
    // Get letter grade
    const { letter, coefficient } = getLetterGradeFromTScore(tScore, classSizeVal, finalVal);
    
    // Display results
    letterGradeElement.textContent = letter;
    numericGradeElement.textContent = coefficient.toFixed(2);
    
    // Check if passing grade and show appropriate message and color
    const passingGrades = ['AA', 'BA', 'BB', 'CB', 'CC', 'DC'];
    if (passingGrades.includes(letter)) {
        if (finalVal < 45) {
            gradeResult.className = 'result fail';
            gradeMessage.textContent = 'Final notunuz 45\'in altında olduğu için dersten kaldınız.';
        } else {
            gradeResult.className = 'result pass';
            gradeMessage.textContent = 'Tebrikler! Bu dersi başarıyla geçtiniz.';
        }
    } else {
        gradeResult.className = 'result fail';
        gradeMessage.textContent = 'Üzgünüz, bu derstten geçer not alamadınız.';
    }
});

// Reverse Calculation Event Handler
calculateReverse.addEventListener('click', () => {
    // Get input values
    const midtermVal = parseFloat(revMidtermGrade.value);
    const averageVal = parseFloat(revClassAverage.value);
    const stdDevVal = parseFloat(revStandardDeviation.value);
    const classSizeVal = getSelectedRadioValue(revClassSizeRadios);
    
    // Validation
    if (isNaN(midtermVal) || isNaN(averageVal) || isNaN(stdDevVal)) {
        alert('Lütfen tüm alanları doldurun.');
        return;
    }
    
    if (midtermVal < 0 || midtermVal > 100 || averageVal < 0 || averageVal > 100 || stdDevVal < 0) {
        alert('Lütfen geçerli değerler girin.');
        return;
    }
    
    // Get grade thresholds based on class size
    let thresholds;
    if (classSizeVal === 'small') {
        thresholds = { 'AA': 57, 'BA': 52, 'BB': 47, 'CB': 42, 'CC': 37, 'DC': 32, 'DD': 27 };
    } else if (classSizeVal === 'medium') {
        thresholds = { 'AA': 62, 'BA': 57, 'BB': 52, 'CB': 47, 'CC': 42, 'DC': 37, 'DD': 32 };
    } else {
        thresholds = { 'AA': 67, 'BA': 62, 'BB': 57, 'CB': 52, 'CC': 47, 'DC': 42, 'DD': 37 };
    }
    
    // Calculate required final grades for each letter grade
    const aaGradeValue = calculateRequiredFinalGrade(midtermVal, averageVal, stdDevVal, thresholds['AA'], classSizeVal);
    const baGradeValue = calculateRequiredFinalGrade(midtermVal, averageVal, stdDevVal, thresholds['BA'], classSizeVal);
    const bbGradeValue = calculateRequiredFinalGrade(midtermVal, averageVal, stdDevVal, thresholds['BB'], classSizeVal);
    const cbGradeValue = calculateRequiredFinalGrade(midtermVal, averageVal, stdDevVal, thresholds['CB'], classSizeVal);
    const ccGradeValue = calculateRequiredFinalGrade(midtermVal, averageVal, stdDevVal, thresholds['CC'], classSizeVal);
    const dcGradeValue = calculateRequiredFinalGrade(midtermVal, averageVal, stdDevVal, thresholds['DC'], classSizeVal);
    const ddGradeValue = calculateRequiredFinalGrade(midtermVal, averageVal, stdDevVal, thresholds['DD'], classSizeVal);
    
    // Set the text content for all grades
    aaGrade.textContent = aaGradeValue;
    baGrade.textContent = baGradeValue;
    bbGrade.textContent = bbGradeValue;
    cbGrade.textContent = cbGradeValue;
    ccGrade.textContent = ccGradeValue;
    dcGrade.textContent = dcGradeValue;
    ddGrade.textContent = ddGradeValue;
    
    // Highlight impossible grades (greater than 100)
    const gradeElements = [
        { element: aaGrade, value: aaGradeValue },
        { element: baGrade, value: baGradeValue },
        { element: bbGrade, value: bbGradeValue },
        { element: cbGrade, value: cbGradeValue },
        { element: ccGrade, value: ccGradeValue },
        { element: dcGrade, value: dcGradeValue },
        { element: ddGrade, value: ddGradeValue }
    ];
    
    gradeElements.forEach(({ element, value }) => {
        if (value > 100) {
            element.innerHTML = '<span style="color: red;">Ulaşılamaz</span>';
        } else if (value < 45) {
            // Show original grade value along with the minimum requirement note
            element.innerHTML = `<span style="color: orange;">Min. 45 (${value})</span>`;
        }
    });
});