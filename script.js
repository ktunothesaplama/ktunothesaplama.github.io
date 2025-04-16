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

// DOM Elements - Weight Selection
const defaultWeightRadio = document.getElementById('defaultWeight');
const customWeightRadio = document.getElementById('customWeight');
const midtermWeightInput = document.getElementById('midtermWeight');
const finalWeightInput = document.getElementById('finalWeight');

const revDefaultWeightRadio = document.getElementById('revDefaultWeight');
const revCustomWeightRadio = document.getElementById('revCustomWeight');
const revMidtermWeightInput = document.getElementById('revMidtermWeight');
const revFinalWeightInput = document.getElementById('revFinalWeight');

// Enable/disable weight inputs based on selection
defaultWeightRadio.addEventListener('change', () => {
    if (defaultWeightRadio.checked) {
        midtermWeightInput.disabled = true;
        finalWeightInput.disabled = true;
        midtermWeightInput.value = 50;
        finalWeightInput.value = 50;
    }
});

customWeightRadio.addEventListener('change', () => {
    if (customWeightRadio.checked) {
        midtermWeightInput.disabled = false;
        finalWeightInput.disabled = true; // Keep this readonly, will be calculated
    }
});

midtermWeightInput.addEventListener('input', () => {
    const midtermWeight = parseInt(midtermWeightInput.value) || 0;
    // Ensure value is between 1-99
    if (midtermWeight < 1) midtermWeightInput.value = 1;
    if (midtermWeight > 99) midtermWeightInput.value = 99;
    
    // Update final weight to complement midterm weight (total 100%)
    finalWeightInput.value = 100 - parseInt(midtermWeightInput.value);
});

// Same event listeners for reverse calculation weight inputs
revDefaultWeightRadio.addEventListener('change', () => {
    if (revDefaultWeightRadio.checked) {
        revMidtermWeightInput.disabled = true;
        revFinalWeightInput.disabled = true;
        revMidtermWeightInput.value = 50;
        revFinalWeightInput.value = 50;
    }
});

revCustomWeightRadio.addEventListener('change', () => {
    if (revCustomWeightRadio.checked) {
        revMidtermWeightInput.disabled = false;
        revFinalWeightInput.disabled = true; // Keep this readonly, will be calculated
    }
});

revMidtermWeightInput.addEventListener('input', () => {
    const midtermWeight = parseInt(revMidtermWeightInput.value) || 0;
    // Ensure value is between 1-99
    if (midtermWeight < 1) revMidtermWeightInput.value = 1;
    if (midtermWeight > 99) revMidtermWeightInput.value = 99;
    
    // Update final weight to complement midterm weight (total 100%)
    revFinalWeightInput.value = 100 - parseInt(revMidtermWeightInput.value);
});

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
function getLetterGradeFromTScore(tScore, classSize, finalGrade = null, averageVal = null, midtermVal = null) {
    // Fail condition: Final grade less than 45
    if (finalGrade !== null && finalGrade < 45) {
        return { letter: 'FF', coefficient: 0 };
    }

    // Get the class average value
    const averageValue = averageVal !== null ? averageVal : parseFloat(classAverage.value);
    
    // Map letter grades to coefficients
    const coeffMap = {
        'AA': 4.0, 'BA': 3.5, 'BB': 3.0, 'CB': 2.5,
        'CC': 2.0, 'DC': 1.5, 'DD': 1.0, 'FD': 0.5, 'FF': 0.0
    };
    
    // Use Table 3 for small classes (less than 10 students) or high class average (≥ 80)
    if (classSize === 'small' || averageValue >= 80) {
        // For small classes or high average, we use Ham Başarı Notu (raw score)
        // We need midterm and final values to calculate raw score
        let rawScore;
        if (midtermVal !== null && finalGrade !== null) {
            // Get weight values (default is 50-50 if not specified)
            const midtermWeight = parseInt(midtermWeightInput.value) / 100;
            const finalWeight = parseInt(finalWeightInput.value) / 100;
            
            // Calculate Ham Başarı Notu
            rawScore = (midtermVal * midtermWeight) + (finalGrade * finalWeight);
        } else {
            // If we don't have midterm and final, use the T-score as a fallback
            rawScore = tScore;
        }
        
        // Table 3 thresholds
        if (rawScore >= 90) return { letter: 'AA', coefficient: coeffMap['AA'] };
        if (rawScore >= 80) return { letter: 'BA', coefficient: coeffMap['BA'] };
        if (rawScore >= 75) return { letter: 'BB', coefficient: coeffMap['BB'] };
        if (rawScore >= 70) return { letter: 'CB', coefficient: coeffMap['CB'] };
        if (rawScore >= 60) return { letter: 'CC', coefficient: coeffMap['CC'] };
        if (rawScore >= 50) return { letter: 'DC', coefficient: coeffMap['DC'] };
        if (rawScore >= 40) return { letter: 'DD', coefficient: coeffMap['DD'] };
        if (rawScore >= 30) return { letter: 'FD', coefficient: coeffMap['FD'] };
        return { letter: 'FF', coefficient: coeffMap['FF'] };
    } else {
        // For larger classes, use T-score based grading
        const gradeMap = getGradeMapForClassAverage(averageValue);
        
        // Create a sorted array of grade thresholds in descending order
        const gradeThresholds = [
            { letter: 'AA', minScore: gradeMap.AA },
            { letter: 'BA', minScore: gradeMap.BA },
            { letter: 'BB', minScore: gradeMap.BB },
            { letter: 'CB', minScore: gradeMap.CB },
            { letter: 'CC', minScore: gradeMap.CC },
            { letter: 'DC', minScore: gradeMap.DC },
            { letter: 'DD', minScore: gradeMap.DD },
            { letter: 'FD', minScore: gradeMap.FD },
            { letter: 'FF', minScore: 0 }
        ];
        
        // Determine letter grade based on T-score
        for (const grade of gradeThresholds) {
            if (tScore >= grade.minScore) {
                return { letter: grade.letter, coefficient: coeffMap[grade.letter] };
            }
        }
    }

    // Default to FF if no match found (should never reach here)
    return { letter: 'FF', coefficient: 0 };
}

// Get dynamic grade map based on class average
function getGradeMapForClassAverage(averageValue) {
    // First check for absolute grading threshold (Class Average ≥ 80)
    if (averageValue >= 80) {
        return {
            'AA': 90, 'BA': 80, 'BB': 75, 'CB': 70, 
            'CC': 60, 'DC': 50, 'DD': 40, 'FD': 30, 'FF': 0
        };
    }
    
    // Determine the level based on class average according to KTU Table 1
    let level;
    if (averageValue > 70 && averageValue < 80) {
        level = 'excellent';
    } else if (averageValue > 62.5 && averageValue <= 70) {
        level = 'very-good';
    } else if (averageValue > 57.5 && averageValue <= 62.5) {
        level = 'good';
    } else if (averageValue > 52.5 && averageValue <= 57.5) {
        level = 'above-average';
    } else if (averageValue > 47.5 && averageValue <= 52.5) {
        level = 'average';
    } else if (averageValue > 42.5 && averageValue <= 47.5) {
        level = 'below-average';
    } else { // ≤ 42.5
        level = 'poor';
    }
    
    // Set grade thresholds based on class average level
    let gradeMap;
    
    switch(level) {
        case 'excellent':
            gradeMap = {
                'AA': 59, 'BA': 54, 'BB': 49, 'CB': 44, 
                'CC': 39, 'DC': 34, 'DD': 29, 'FD': 24, 'FF': 0
            };
            break;
        case 'very-good':
            gradeMap = {
                'AA': 61, 'BA': 56, 'BB': 51, 'CB': 46, 
                'CC': 41, 'DC': 36, 'DD': 31, 'FD': 26, 'FF': 0
            };
            break;
        case 'good':
            gradeMap = {
                'AA': 63, 'BA': 58, 'BB': 53, 'CB': 48, 
                'CC': 43, 'DC': 38, 'DD': 33, 'FD': 28, 'FF': 0
            };
            break;
        case 'above-average':
            gradeMap = {
                'AA': 65, 'BA': 60, 'BB': 55, 'CB': 50, 
                'CC': 45, 'DC': 40, 'DD': 35, 'FD': 30, 'FF': 0
            };
            break;
        case 'average':
            gradeMap = {
                'AA': 67, 'BA': 62, 'BB': 57, 'CB': 52, 
                'CC': 47, 'DC': 42, 'DD': 37, 'FD': 32, 'FF': 0
            };
            break;
        case 'below-average':
            gradeMap = {
                'AA': 69, 'BA': 64, 'BB': 59, 'CB': 54, 
                'CC': 49, 'DC': 44, 'DD': 39, 'FD': 34, 'FF': 0
            };
            break;
        case 'poor':
            gradeMap = {
                'AA': 71, 'BA': 66, 'BB': 61, 'CB': 56, 
                'CC': 51, 'DC': 46, 'DD': 41, 'FD': 36, 'FF': 0
            };
            break;
    }
    
    return gradeMap;
}

// Straight Calculation Event Handler
calculateGrade.addEventListener('click', () => {
    // Get input values
    const midtermVal = parseFloat(midtermGrade.value);
    const finalVal = parseFloat(finalGrade.value);
    const averageVal = parseFloat(classAverage.value);
    const stdDevVal = parseFloat(standardDeviation.value);
    const classSizeVal = getSelectedRadioValue(classSizeRadios);
    
    // Get weight values
    const midtermWeight = parseInt(midtermWeightInput.value) / 100;
    const finalWeight = parseInt(finalWeightInput.value) / 100;
    
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
    
    // Calculate total grade using custom weights
    const totalGrade = (midtermVal * midtermWeight) + (finalVal * finalWeight);
    
    // Calculate T-Score
    const tScore = calculateTScore(totalGrade, averageVal, stdDevVal);
    
    // Debug information - Create a hidden debug div if not exists
    let debugDiv = document.getElementById('debugInfo');
    if (!debugDiv) {
        debugDiv = document.createElement('div');
        debugDiv.id = 'debugInfo';
        debugDiv.style.backgroundColor = '#f0f0f0';
        debugDiv.style.padding = '10px';
        debugDiv.style.margin = '10px 0';
        debugDiv.style.borderRadius = '5px';
        debugDiv.style.fontFamily = 'monospace';
        debugDiv.style.whiteSpace = 'pre-wrap';
        debugDiv.style.fontSize = '12px';
        gradeResult.after(debugDiv);
    }
    
    // Determine level based on average
    let level = "unknown";
    if (averageVal >= 80) {
        level = "absolute";
    } else if (averageVal > 70 && averageVal < 80) {
        level = "excellent";
    } else if (averageVal > 62.5 && averageVal <= 70) {
        level = "very-good";
    } else if (averageVal > 57.5 && averageVal <= 62.5) {
        level = "good";
    } else if (averageVal > 52.5 && averageVal <= 57.5) {
        level = "above-average";
    } else if (averageVal > 47.5 && averageVal <= 52.5) {
        level = "average";
    } else if (averageVal > 42.5 && averageVal <= 47.5) {
        level = "below-average";
    } else { // ≤ 42.5
        level = "poor";
    }
    
    // Get grade map for debugging
    const gradeMap = getGradeMapForClassAverage(averageVal);
    
    // Get letter grade
    const { letter, coefficient } = getLetterGradeFromTScore(tScore, classSizeVal, finalVal, averageVal, midtermVal);
    
    // Display debug information
    debugDiv.innerHTML = `
        <strong>Hesaplama Detayları:</strong>
        <hr>
        Midterm: ${midtermVal}
        Final: ${finalVal}
        Ağırlıklar: Vize ${(midtermWeight*100).toFixed(0)}% - Final ${(finalWeight*100).toFixed(0)}%
        Ham Başarı Notu (HBN): ${totalGrade.toFixed(2)}
        Sınıf Ortalaması: ${averageVal}
        Standart Sapma: ${stdDevVal}
        T-Score: ${tScore.toFixed(2)}
        Sınıf Mevcud Tipi: ${classSizeVal}
        Ortalama Seviyesi: ${level}
        
        <strong>Not Aralıkları:</strong>
        AA: T ≥ ${gradeMap.AA}
        BA: T ≥ ${gradeMap.BA}
        BB: T ≥ ${gradeMap.BB}
        CB: T ≥ ${gradeMap.CB}
        CC: T ≥ ${gradeMap.CC}
        DC: T ≥ ${gradeMap.DC}
        DD: T ≥ ${gradeMap.DD}
        FD: T ≥ ${gradeMap.FD}
        FF: T < ${gradeMap.FD}
        
        <strong>Sonuç:</strong> ${letter} (${coefficient.toFixed(2)})
    `;
    
    // Display results
    letterGradeElement.textContent = letter;
    numericGradeElement.textContent = coefficient.toFixed(2);
    
    // Check if passing grade and show appropriate message and color
    const passingGrades = ['AA', 'BA', 'BB', 'CB', 'CC'];
    const conditionalGrade = 'DC';
    
    if (passingGrades.includes(letter)) {
        if (finalVal < 45) {
            gradeResult.className = 'result fail';
            gradeMessage.textContent = 'Final notunuz 45\'in altında olduğu için dersten kaldınız.';
        } else {
            gradeResult.className = 'result pass';
            gradeMessage.textContent = 'Tebrikler! Bu dersi başarıyla geçtiniz.';
        }
    } else if (letter === conditionalGrade) {
        // Special case for DC - use yellow color
        if (finalVal < 45) {
            gradeResult.className = 'result fail';
            gradeMessage.textContent = 'Final notunuz 45\'in altında olduğu için dersten kaldınız.';
        } else {
            gradeResult.className = 'result conditional';
            gradeMessage.textContent = 'DC notu ile dönem ortalamanız 2.00 ve üzeri ise dersi şartlı geçtiniz.';
        }
    } else {
        gradeResult.className = 'result fail';
        gradeMessage.textContent = 'Üzgünüz, bu derstten geçer not alamadınız.';
    }
});

// Calculate required final grade for a specific letter grade
function calculateRequiredFinalGrade(midterm, average, stdDev, targetTScore, classSize, midtermWeightPercent = null, finalWeightPercent = null) {
    // Get weight percentages (with defaults if not provided)
    const midtermWeight = midtermWeightPercent !== null ? midtermWeightPercent / 100 : parseInt(revMidtermWeightInput.value) / 100;
    const finalWeight = finalWeightPercent !== null ? finalWeightPercent / 100 : parseInt(revFinalWeightInput.value) / 100;
    
    // For small classes or high class average, use Ham Başarı Notu (raw score) thresholds directly
    if (classSize === 'small' || average >= 80) {
        // For small classes we use the absolute scale (Table 3)
        // formula: totalGrade = (midterm * midtermWeight) + (final * finalWeight)
        // rearranged for final: final = (targetRawScore - (midterm * midtermWeight)) / finalWeight
        
        // Calculate required final grade to achieve the target raw score
        const requiredFinal = (targetTScore - (parseFloat(midterm) * midtermWeight)) / finalWeight;
        return Math.max(Math.min(Math.ceil(requiredFinal), 100), 0); // Ceiling the value and limit to 0-100 range
    } else {
        // For larger classes, calculate based on T-score system
        // Calculate required average for the target T-score
        const requiredAverage = (((targetTScore - 50) / 10) * stdDev) + parseFloat(average);
        
        // Calculate required final grade based on weights
        const requiredFinal = (requiredAverage - (parseFloat(midterm) * midtermWeight)) / finalWeight;
        return Math.max(Math.min(Math.ceil(requiredFinal), 100), 0); // Ceiling the value and limit to 0-100 range
    }
}

// Reverse Calculation Event Handler
calculateReverse.addEventListener('click', () => {
    // Get input values
    const midtermVal = parseFloat(revMidtermGrade.value);
    const averageVal = parseFloat(revClassAverage.value);
    const stdDevVal = parseFloat(revStandardDeviation.value);
    const classSizeVal = getSelectedRadioValue(revClassSizeRadios);
    
    // Get weight values
    const midtermWeight = parseInt(revMidtermWeightInput.value);
    const finalWeight = parseInt(revFinalWeightInput.value);
    
    // Validation
    if (isNaN(midtermVal) || isNaN(averageVal) || isNaN(stdDevVal)) {
        alert('Lütfen tüm alanları doldurun.');
        return;
    }
    
    if (midtermVal < 0 || midtermVal > 100 || averageVal < 0 || averageVal > 100 || stdDevVal < 0) {
        alert('Lütfen geçerli değerler girin.');
        return;
    }
    
    // First check for absolute grading threshold (Class Average ≥ 80)
    let thresholds;
    
    if (averageVal >= 80) {
        thresholds = { 'AA': 90, 'BA': 80, 'BB': 75, 'CB': 70, 'CC': 60, 'DC': 50, 'DD': 40, 'FD': 30};
    } else {
        // Determine the level based on class average
        let level;
        if (averageVal > 70 && averageVal < 80) {
            level = 'excellent';
        } else if (averageVal > 62.5 && averageVal <= 70) {
            level = 'very-good';
        } else if (averageVal > 57.5 && averageVal <= 62.5) {
            level = 'good';
        } else if (averageVal > 52.5 && averageVal <= 57.5) {
            level = 'above-average';
        } else if (averageVal > 47.5 && averageVal <= 52.5) {
            level = 'average';
        } else if (averageVal > 42.5 && averageVal <= 47.5) {
            level = 'below-average';
        } else { // ≤ 42.5
            level = 'poor';
        }
        
        // Get grade thresholds based on level and class size
        if (classSizeVal === 'small') { // Less than 10 students
            thresholds = { 'AA': 90, 'BA': 80, 'BB': 75, 'CB': 70, 'CC': 60, 'DC': 50, 'DD': 40, 'FD': 30};
            // Note: Removed level cases for small class size as they use a fixed scale
        } else { // More than 30 students
            switch(level) {
                case 'excellent':
                    thresholds = { 'AA': 59, 'BA': 54, 'BB': 49, 'CB': 44, 'CC': 39, 'DC': 34, 'DD': 29 };
                    break;
                case 'very-good':
                    thresholds = { 'AA': 61, 'BA': 56, 'BB': 51, 'CB': 46, 'CC': 41, 'DC': 36, 'DD': 31 };
                    break;
                case 'good':
                    thresholds = { 'AA': 63, 'BA': 58, 'BB': 53, 'CB': 48, 'CC': 43, 'DC': 38, 'DD': 33 };
                    break;
                case 'above-average':
                    thresholds = { 'AA': 65, 'BA': 60, 'BB': 55, 'CB': 50, 'CC': 45, 'DC': 40, 'DD': 35 };
                    break;
                case 'average':
                    thresholds = { 'AA': 67, 'BA': 62, 'BB': 57, 'CB': 52, 'CC': 47, 'DC': 42, 'DD': 37 };
                    break;
                case 'below-average':
                    thresholds = { 'AA': 69, 'BA': 64, 'BB': 59, 'CB': 54, 'CC': 49, 'DC': 44, 'DD': 39 };
                    break;
                case 'poor':
                    thresholds = { 'AA': 71, 'BA': 66, 'BB': 61, 'CB': 56, 'CC': 51, 'DC': 46, 'DD': 41 };
                    break;
            }
        }
    }
    
    // Calculate required final grades for each letter grade with custom weights
    const aaGradeValue = calculateRequiredFinalGrade(midtermVal, averageVal, stdDevVal, thresholds['AA'], classSizeVal, midtermWeight, finalWeight);
    const baGradeValue = calculateRequiredFinalGrade(midtermVal, averageVal, stdDevVal, thresholds['BA'], classSizeVal, midtermWeight, finalWeight);
    const bbGradeValue = calculateRequiredFinalGrade(midtermVal, averageVal, stdDevVal, thresholds['BB'], classSizeVal, midtermWeight, finalWeight);
    const cbGradeValue = calculateRequiredFinalGrade(midtermVal, averageVal, stdDevVal, thresholds['CB'], classSizeVal, midtermWeight, finalWeight);
    const ccGradeValue = calculateRequiredFinalGrade(midtermVal, averageVal, stdDevVal, thresholds['CC'], classSizeVal, midtermWeight, finalWeight);
    const dcGradeValue = calculateRequiredFinalGrade(midtermVal, averageVal, stdDevVal, thresholds['DC'], classSizeVal, midtermWeight, finalWeight);
    const ddGradeValue = calculateRequiredFinalGrade(midtermVal, averageVal, stdDevVal, thresholds['DD'], classSizeVal, midtermWeight, finalWeight);
    
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