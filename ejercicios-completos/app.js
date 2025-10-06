// URL del Google Apps Script
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx4fSATU8vqCqUJLn6hSPKEuTEWxe8iKzZuTYG0LMXljcSjgVwhw_wTbG2gWQIWih_1/exec';

// Datos de los ejercicios y respuestas correctas
const EXERCISE_DATA = {
    pasados: {
        exercise1: {
            answers: { q1: 'c', q2: 'b', q3: 'b', q4: 'c' },
            questions: [
                'When I arrived at the station, the train ___________ already left.',
                'At 9 p.m. last night, I ___________ dinner.',
                'While I ___________ TV, my brother called me.',
                'She ___________ all the emails before the meeting started.'
            ]
        },
        exercise2: {
            answers: {
                gap1: ['had already started'],
                gap2: ['was reading'],
                gap3: ['had finished'],
                gap4: ['was walking']
            },
            questions: [
                'When we got to the cinema, the movie ___________ (already / start).',
                'I ___________ (read) a book when the phone rang.',
                'They ___________ (finish) the project before the boss arrived.',
                'Yesterday, she ___________ (walk) in the park when it started to rain.'
            ]
        }
    },
    futuro: {
        exercise1: {
            answers: { q1: 'd', q2: 'c', q3: 'b', q4: 'a' },
            questions: [
                'Look at those dark clouds! It ___________ rain soon.',
                'By this time next year, I ___________ my degree.',
                'This time tomorrow, we ___________ on the beach.',
                'I forgot to buy milk. I ___________ go to the store now.'
            ]
        },
        exercise2: {
            answers: {
                gap1: ['will have finished'],
                gap2: ['is going to hit'],
                gap3: ['will be traveling', 'will be travelling'],
                gap4: ['will call']
            },
            questions: [
                'By 8 p.m., she ___________ (finish) her homework.',
                'Look at that car! It ___________ (hit) the fence if it keeps going that fast.',
                'Tomorrow at this time, we ___________ (travel) to Paris.',
                'I think I ___________ (call) my friend later, I miss talking to her.'
            ]
        }
    }
};

// Estado global de la aplicación
let appState = {
    currentPage: 1,
    userData: {
        nombre: '',
        apellido: ''
    },
    dataSubmitted: false, // Nueva propiedad para controlar si los datos fueron enviados
    selectedSection: null, // 'pasados' o 'futuro' or both
    scores: {
        pasados: {
            exercise1: 0,
            exercise2: 0,
            total: 0,
            completed: false
        },
        futuro: {
            exercise1: 0,
            exercise2: 0,
            total: 0,
            completed: false
        }
    },
    results: {
        pasados: {
            exercise1: [],
            exercise2: []
        },
        futuro: {
            exercise1: [],
            exercise2: []
        }
    }
};

// Elementos del DOM
const elements = {
    // Páginas
    page1: document.getElementById('page1'),
    page2: document.getElementById('page2'),
    page3: document.getElementById('page3'),
    page4: document.getElementById('page4'),
    page5: document.getElementById('page5'),
    page6: document.getElementById('page6'),
    
    // Formularios
    personalDataForm: document.getElementById('personalDataForm'),
    exercisePasados1Form: document.getElementById('exercisePasados1Form'),
    exercisePasados2Form: document.getElementById('exercisePasados2Form'),
    exerciseFuturo1Form: document.getElementById('exerciseFuturo1Form'),
    exerciseFuturo2Form: document.getElementById('exerciseFuturo2Form'),
    
    // Inputs
    nombreInput: document.getElementById('nombreInput'),
    apellidoInput: document.getElementById('apellidoInput'),
    
    // Botones de selección
    selectPasados: document.getElementById('selectPasados'),
    selectFuturo: document.getElementById('selectFuturo'),
    
    // Botones de navegación
    navToFuturo: document.getElementById('navToFuturo'),
    navToFuturo2: document.getElementById('navToFuturo2'),
    navToPasados: document.getElementById('navToPasados'),
    navToPasados2: document.getElementById('navToPasados2'),
    navToResults: document.getElementById('navToResults'),
    navToResults2: document.getElementById('navToResults2'),
    navToResults3: document.getElementById('navToResults3'),
    navToResults4: document.getElementById('navToResults4'),
    backToPasados: document.getElementById('backToPasados'),
    backToFuturo: document.getElementById('backToFuturo'),
    
    // Botones de continuación
    continueToPasados2: document.getElementById('continueToPasados2'),
    continueToFuturo2: document.getElementById('continueToFuturo2'),
    goToFuturoFromPasados: document.getElementById('goToFuturoFromPasados'),
    goToFinalResults: document.getElementById('goToFinalResults'),
    
    // Áreas de resultados
    exercisePasados1Results: document.getElementById('exercisePasados1Results'),
    exercisePasados2Results: document.getElementById('exercisePasados2Results'),
    exerciseFuturo1Results: document.getElementById('exerciseFuturo1Results'),
    exerciseFuturo2Results: document.getElementById('exerciseFuturo2Results'),
    
    // Scores
    exercisePasados1Score: document.getElementById('exercisePasados1Score'),
    exercisePasados2Score: document.getElementById('exercisePasados2Score'),
    exerciseFuturo1Score: document.getElementById('exerciseFuturo1Score'),
    exerciseFuturo2Score: document.getElementById('exerciseFuturo2Score'),
    
    // Feedback
    exercisePasados1Feedback: document.getElementById('exercisePasados1Feedback'),
    exercisePasados2Feedback: document.getElementById('exercisePasados2Feedback'),
    exerciseFuturo1Feedback: document.getElementById('exerciseFuturo1Feedback'),
    exerciseFuturo2Feedback: document.getElementById('exerciseFuturo2Feedback'),
    
    // Resultados finales
    studentName: document.getElementById('studentName'),
    finalScorePasados1: document.getElementById('finalScorePasados1'),
    finalScorePasados2: document.getElementById('finalScorePasados2'),
    finalScoreFuturo1: document.getElementById('finalScoreFuturo1'),
    finalScoreFuturo2: document.getElementById('finalScoreFuturo2'),
    totalScorePasados: document.getElementById('totalScorePasados'),
    totalScoreFuturo: document.getElementById('totalScoreFuturo'),
    statusPasados: document.getElementById('statusPasados'),
    statusFuturo: document.getElementById('statusFuturo'),
    
    // Estados de carga
    sendResults: document.getElementById('sendResults'),
    sendText: document.getElementById('sendText'),
    sendingText: document.getElementById('sendingText'),
    sendResultsMessage: document.getElementById('sendResultsMessage'),
    
    // Área de mensajes
    messageArea1: document.getElementById('messageArea1')
};

// Event listeners
document.addEventListener('DOMContentLoaded', initializeApp);

// Formulario de datos personales - ahora sin evento submit, solo validación en tiempo real
elements.personalDataForm.addEventListener('submit', handlePersonalDataSubmit);

// Botones de selección - estos ahora actúan como navegación directa
elements.selectPasados.addEventListener('click', () => selectSection('pasados'));
elements.selectFuturo.addEventListener('click', () => selectSection('futuro'));

// Formularios de ejercicios
elements.exercisePasados1Form.addEventListener('submit', (e) => handleExerciseSubmit(e, 'pasados', 1));
elements.exercisePasados2Form.addEventListener('submit', (e) => handleExerciseSubmit(e, 'pasados', 2));
elements.exerciseFuturo1Form.addEventListener('submit', (e) => handleExerciseSubmit(e, 'futuro', 1));
elements.exerciseFuturo2Form.addEventListener('submit', (e) => handleExerciseSubmit(e, 'futuro', 2));

// Botones de continuación
elements.continueToPasados2.addEventListener('click', () => goToPage('page3'));
elements.continueToFuturo2.addEventListener('click', () => goToPage('page5'));
elements.goToFuturoFromPasados.addEventListener('click', () => goToPage('page4'));
elements.goToFinalResults.addEventListener('click', () => goToFinalResults());

// Navegación entre secciones
elements.navToFuturo?.addEventListener('click', () => goToPage('page4'));
elements.navToFuturo2?.addEventListener('click', () => goToPage('page4'));
elements.navToPasados?.addEventListener('click', () => goToPage('page2'));
elements.navToPasados2?.addEventListener('click', () => goToPage('page2'));
elements.backToPasados?.addEventListener('click', () => goToPage('page2'));
elements.backToFuturo?.addEventListener('click', () => goToPage('page4'));

// Navegación a resultados
elements.navToResults?.addEventListener('click', () => goToFinalResults());
elements.navToResults2?.addEventListener('click', () => goToFinalResults());
elements.navToResults3?.addEventListener('click', () => goToFinalResults());
elements.navToResults4?.addEventListener('click', () => goToFinalResults());

// Envío de resultados
elements.sendResults.addEventListener('click', sendResultsToGoogleSheets);

// Validación en tiempo real para datos personales
elements.nombreInput.addEventListener('input', handlePersonalDataChange);
elements.apellidoInput.addEventListener('input', handlePersonalDataChange);

/**
 * Inicializa la aplicación
 */
function initializeApp() {
    elements.nombreInput.focus();
    showMessage('Completa tus datos personales y selecciona los ejercicios que deseas realizar.', 'info');
}

/**
 * Maneja cambios en los datos personales y actualiza el estado
 */
function handlePersonalDataChange() {
    const nombre = elements.nombreInput.value.trim();
    const apellido = elements.apellidoInput.value.trim();
    
    // Actualizar datos en tiempo real
    appState.userData.nombre = nombre;
    appState.userData.apellido = apellido;
    
    // Limpiar mensajes de error previos
    elements.messageArea1.innerHTML = '';
    
    // Si ambos campos están completos, mostrar mensaje de éxito
    if (nombre && apellido) {
        showMessage('Datos completos. Puedes seleccionar una sección para comenzar los ejercicios.', 'success');
        appState.dataSubmitted = true;
    } else {
        appState.dataSubmitted = false;
    }
}

/**
 * Maneja el envío del formulario de datos personales (si existe un botón submit)
 */
function handlePersonalDataSubmit(e) {
    e.preventDefault();
    
    const nombre = elements.nombreInput.value.trim();
    const apellido = elements.apellidoInput.value.trim();
    
    // Validar campos
    if (!nombre || !apellido) {
        showMessage('Por favor, completa todos los campos requeridos.', 'error');
        return;
    }
    
    // Guardar datos
    appState.userData.nombre = nombre;
    appState.userData.apellido = apellido;
    appState.dataSubmitted = true;
    
    showMessage('Datos guardados. Selecciona una sección para comenzar los ejercicios.', 'success');
}

/**
 * Selecciona una sección de ejercicios
 */
function selectSection(section) {
    // Validar que se hayan ingresado los datos personales
    const nombre = elements.nombreInput.value.trim();
    const apellido = elements.apellidoInput.value.trim();
    
    if (!nombre || !apellido) {
        showMessage('Por favor, completa todos los campos requeridos antes de continuar.', 'error');
        elements.nombreInput.focus();
        return;
    }
    
    // Guardar datos si no están guardados
    if (!appState.dataSubmitted) {
        appState.userData.nombre = nombre;
        appState.userData.apellido = apellido;
        appState.dataSubmitted = true;
    }
    
    // Actualizar selección visual
    document.querySelectorAll('.btn--selection').forEach(btn => {
        btn.classList.remove('btn--selection--selected');
    });
    
    if (section === 'pasados') {
        elements.selectPasados.classList.add('btn--selection--selected');
        goToPage('page2');
    } else if (section === 'futuro') {
        elements.selectFuturo.classList.add('btn--selection--selected');
        goToPage('page4');
    }
    
    appState.selectedSection = section;
}

/**
 * Maneja el envío de ejercicios
 */
function handleExerciseSubmit(e, section, exerciseNum) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const exerciseData = EXERCISE_DATA[section][`exercise${exerciseNum}`];
    
    if (exerciseNum === 1) {
        handleMultipleChoiceSubmit(formData, section, exerciseData);
    } else {
        handleFillGapsSubmit(formData, section, exerciseData);
    }
}

/**
 * Maneja el envío de ejercicios de opción múltiple
 */
function handleMultipleChoiceSubmit(formData, section, exerciseData) {
    const answers = {};
    const results = [];
    let correctCount = 0;
    
    // Recoger respuestas del usuario
    for (let [key, value] of formData.entries()) {
        answers[key] = value;
    }
    
    // Verificar que todas las preguntas estén respondidas
    const expectedQuestions = ['q1', 'q2', 'q3', 'q4'];
    for (let question of expectedQuestions) {
        if (!answers[question]) {
            showMessage('Por favor, responde todas las preguntas antes de continuar.', 'error');
            return;
        }
    }
    
    // Evaluar respuestas
    expectedQuestions.forEach((question, index) => {
        const userAnswer = answers[question];
        const correctAnswer = exerciseData.answers[question];
        const isCorrect = userAnswer === correctAnswer;
        
        if (isCorrect) correctCount++;
        
        results.push({
            question: index + 1,
            userAnswer,
            correctAnswer,
            isCorrect,
            questionText: exerciseData.questions[index]
        });
    });
    
    // Calcular puntuación
    const score = correctCount * 2.5;
    appState.scores[section].exercise1 = score;
    appState.results[section].exercise1 = results;
    
    // Mostrar resultados
    showExerciseResults(section, 1, results, score);
    updateMultipleChoiceVisual(section, results);
    
    // Mostrar botón para continuar
    const form = section === 'pasados' ? elements.exercisePasados1Form : elements.exerciseFuturo1Form;
    const submitBtn = form.querySelector('button[type="submit"]');
    const continueBtn = section === 'pasados' ? elements.continueToPasados2 : elements.continueToFuturo2;
    
    submitBtn.classList.add('hidden');
    continueBtn.classList.remove('hidden');
}

/**
 * Maneja el envío de ejercicios de completar huecos
 */
function handleFillGapsSubmit(formData, section, exerciseData) {
    const answers = {};
    const results = [];
    let correctCount = 0;
    
    // Recoger respuestas del usuario
    for (let [key, value] of formData.entries()) {
        answers[key] = value.trim();
    }
    
    // Verificar que todas las preguntas estén respondidas
    const expectedGaps = ['gap1', 'gap2', 'gap3', 'gap4'];
    for (let gap of expectedGaps) {
        if (!answers[gap]) {
            showMessage('Por favor, completa todos los huecos antes de continuar.', 'error');
            return;
        }
    }
    
    // Evaluar respuestas
    expectedGaps.forEach((gap, index) => {
        const userAnswer = answers[gap];
        const correctAnswers = exerciseData.answers[gap];
        const isCorrect = correctAnswers.some(correct => 
            normalizeAnswer(userAnswer) === normalizeAnswer(correct)
        );
        
        if (isCorrect) correctCount++;
        
        results.push({
            question: index + 1,
            userAnswer: answers[gap],
            correctAnswers,
            isCorrect,
            questionText: exerciseData.questions[index]
        });
    });
    
    // Calcular puntuación
    const score = correctCount * 2.5;
    appState.scores[section].exercise2 = score;
    appState.results[section].exercise2 = results;
    
    // Calcular total de la sección
    appState.scores[section].total = (appState.scores[section].exercise1 + score) / 2;
    appState.scores[section].completed = true;
    
    // Mostrar resultados
    showExerciseResults(section, 2, results, score);
    updateGapFillVisual(section, results);
    
    // Mostrar botón apropiado
    const form = section === 'pasados' ? elements.exercisePasados2Form : elements.exerciseFuturo2Form;
    const submitBtn = form.querySelector('button[type="submit"]');
    
    submitBtn.classList.add('hidden');
    
    if (section === 'pasados') {
        elements.goToFuturoFromPasados.classList.remove('hidden');
    } else {
        elements.goToFinalResults.classList.remove('hidden');
    }
}

/**
 * Normaliza una respuesta para comparación
 */
function normalizeAnswer(answer) {
    return answer.toLowerCase()
        .replace(/[.,!?]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

/**
 * Muestra los resultados de un ejercicio
 */
function showExerciseResults(section, exerciseNum, results, score) {
    const scoreElement = elements[`exercise${section.charAt(0).toUpperCase() + section.slice(1)}${exerciseNum}Score`];
    const feedbackElement = elements[`exercise${section.charAt(0).toUpperCase() + section.slice(1)}${exerciseNum}Feedback`];
    const resultsElement = elements[`exercise${section.charAt(0).toUpperCase() + section.slice(1)}${exerciseNum}Results`];
    
    scoreElement.textContent = score.toFixed(1);
    
    const feedbackHtml = results.map(result => {
        const icon = result.isCorrect ? 
            '<span class="feedback-icon feedback-icon--correct">✓</span>' :
            '<span class="feedback-icon feedback-icon--incorrect">✗</span>';
        
        const statusClass = result.isCorrect ? 'feedback-item--correct' : 'feedback-item--incorrect';
        const statusText = result.isCorrect ? 'Correcto' : 'Incorrecto';
        
        let answerText;
        if (exerciseNum === 1) {
            answerText = `Tu respuesta: ${result.userAnswer}) | Respuesta correcta: ${result.correctAnswer})`;
        } else {
            const correctAnswersText = result.correctAnswers.join(' / ');
            answerText = `Tu respuesta: "${result.userAnswer}" | Respuesta correcta: "${correctAnswersText}"`;
        }
        
        return `
            <div class="feedback-item ${statusClass}">
                ${icon}
                <div class="feedback-text">
                    <strong>Pregunta ${result.question}:</strong> ${statusText}<br>
                    ${answerText}
                </div>
            </div>
        `;
    }).join('');
    
    feedbackElement.innerHTML = feedbackHtml;
    resultsElement.classList.remove('hidden');
}

/**
 * Actualiza la visualización de las opciones múltiples
 */
function updateMultipleChoiceVisual(section, results) {
    const pageId = section === 'pasados' ? 'page2' : 'page4';
    const page = document.getElementById(pageId);
    
    results.forEach((result, index) => {
        const questionCards = page.querySelectorAll('.question-card');
        const questionCard = questionCards[index];
        const options = questionCard.querySelectorAll('.option-label');
        
        options.forEach(option => {
            const input = option.querySelector('input');
            const value = input.value;
            
            // Marcar respuesta seleccionada
            if (value === result.userAnswer) {
                option.classList.add('option-label--selected');
                if (result.isCorrect) {
                    option.classList.add('option-label--correct');
                } else {
                    option.classList.add('option-label--incorrect');
                }
            }
            
            // Marcar respuesta correcta si no fue seleccionada
            if (value === result.correctAnswer && value !== result.userAnswer) {
                option.classList.add('option-label--correct');
            }
            
            // Deshabilitar todas las opciones
            input.disabled = true;
        });
    });
}

/**
 * Actualiza la visualización de los campos de texto
 */
function updateGapFillVisual(section, results) {
    const pageId = section === 'pasados' ? 'page3' : 'page5';
    const form = document.getElementById(`exercise${section.charAt(0).toUpperCase() + section.slice(1)}2Form`);
    
    results.forEach((result, index) => {
        const gapInput = form.querySelector(`input[name="gap${index + 1}"]`);
        
        if (result.isCorrect) {
            gapInput.classList.add('gap-input--correct');
        } else {
            gapInput.classList.add('gap-input--incorrect');
        }
        
        gapInput.disabled = true;
    });
}

/**
 * Navega a una página específica
 */
function goToPage(pageId) {
    // Ocultar todas las páginas
    ['page1', 'page2', 'page3', 'page4', 'page5', 'page6'].forEach(id => {
        const page = document.getElementById(id);
        if (page) {
            page.classList.remove('page--active');
            page.classList.add('page--hidden');
        }
    });
    
    // Mostrar la página solicitada
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.remove('page--hidden');
        targetPage.classList.add('page--active');
        
        // Actualizar el estado actual
        appState.currentPage = parseInt(pageId.replace('page', ''));
        
        // Hacer scroll hacia arriba
        window.scrollTo(0, 0);
    }
}

/**
 * Navega a los resultados finales
 */
function goToFinalResults() {
    updateFinalResultsDisplay();
    goToPage('page6');
}

/**
 * Actualiza la visualización de resultados finales
 */
function updateFinalResultsDisplay() {
    // Información del estudiante
    elements.studentName.textContent = `Estudiante: ${appState.userData.nombre} ${appState.userData.apellido}`;
    
    // Puntuaciones individuales
    elements.finalScorePasados1.textContent = `${appState.scores.pasados.exercise1.toFixed(1)}/10`;
    elements.finalScorePasados2.textContent = `${appState.scores.pasados.exercise2.toFixed(1)}/10`;
    elements.finalScoreFuturo1.textContent = `${appState.scores.futuro.exercise1.toFixed(1)}/10`;
    elements.finalScoreFuturo2.textContent = `${appState.scores.futuro.exercise2.toFixed(1)}/10`;
    
    // Puntuaciones totales por sección
    elements.totalScorePasados.textContent = `${appState.scores.pasados.total.toFixed(1)}/10`;
    elements.totalScoreFuturo.textContent = `${appState.scores.futuro.total.toFixed(1)}/10`;
    
    // Estados de completado
    const pasadosCompleted = appState.scores.pasados.completed;
    const futuroCompleted = appState.scores.futuro.completed;
    
    elements.statusPasados.textContent = pasadosCompleted ? 'Completado' : 'No completado';
    elements.statusPasados.className = pasadosCompleted ? 'status-value status--completed' : 'status-value status--pending';
    
    elements.statusFuturo.textContent = futuroCompleted ? 'Completado' : 'No completado';
    elements.statusFuturo.className = futuroCompleted ? 'status-value status--completed' : 'status-value status--pending';
    
    // Estado del botón de envío
    const canSend = pasadosCompleted && futuroCompleted;
    elements.sendResults.disabled = !canSend;
    
    if (canSend) {
        elements.sendText.textContent = 'Enviar Resultados';
    } else {
        elements.sendText.textContent = 'Enviar Resultados (Completa ambas secciones)';
    }
    
    // Agregar clases visuales a las secciones de puntuación
    const pasadosSection = document.querySelector('.section-score:first-child');
    const futuroSection = document.querySelector('.section-score:last-child');
    
    if (pasadosSection) {
        pasadosSection.classList.toggle('section-score--completed', pasadosCompleted);
        pasadosSection.classList.toggle('section-score--incomplete', !pasadosCompleted);
    }
    
    if (futuroSection) {
        futuroSection.classList.toggle('section-score--completed', futuroCompleted);
        futuroSection.classList.toggle('section-score--incomplete', !futuroCompleted);
    }
}

/**
 * Envía los resultados a Google Sheets
 */
async function sendResultsToGoogleSheets() {
    // Verificar que ambas secciones estén completadas
    if (!appState.scores.pasados.completed || !appState.scores.futuro.completed) {
        showResultMessage('Debes completar ambas secciones antes de enviar los resultados.', 'warning');
        return;
    }
    
    setLoadingState(true);
    
    try {
        const formData = new FormData();
        formData.append('nombre', appState.userData.nombre);
        formData.append('apellido', appState.userData.apellido);
        formData.append('puntos_pasados', appState.scores.pasados.total.toFixed(1));
        formData.append('puntos_futuro', appState.scores.futuro.total.toFixed(1));
        formData.append('fecha', new Date().toLocaleDateString('es-ES'));
        
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            body: formData,
            mode: 'no-cors'
        });
        
        showResultMessage('¡Resultados enviados exitosamente!', 'success');
        
        // Deshabilitar el botón después del envío exitoso
        elements.sendResults.disabled = true;
        elements.sendText.textContent = 'Resultados Enviados';
        
        // Opcionalmente ofrecer reiniciar
        setTimeout(() => {
            if (confirm('¿Deseas realizar los ejercicios nuevamente?')) {
                resetApplication();
            }
        }, 3000);
        
    } catch (error) {
        console.error('Error enviando resultados:', error);
        showResultMessage('Error al enviar los resultados. Por favor, intenta nuevamente.', 'error');
    } finally {
        setLoadingState(false);
    }
}

/**
 * Muestra/oculta el estado de carga del botón de envío
 */
function setLoadingState(isLoading) {
    if (isLoading) {
        elements.sendResults.disabled = true;
        elements.sendText.classList.add('hidden');
        elements.sendingText.classList.remove('hidden');
    } else {
        // Solo habilitar si ambas secciones están completadas
        const canSend = appState.scores.pasados.completed && appState.scores.futuro.completed;
        elements.sendResults.disabled = !canSend;
        elements.sendText.classList.remove('hidden');
        elements.sendingText.classList.add('hidden');
    }
}

/**
 * Muestra un mensaje en el área de mensajes principal
 */
function showMessage(message, type = 'info') {
    const messageElement = document.createElement('div');
    messageElement.className = `message message--${type}`;
    
    const icon = getMessageIcon(type);
    messageElement.innerHTML = `${icon} ${message}`;
    
    elements.messageArea1.innerHTML = '';
    elements.messageArea1.appendChild(messageElement);
    
    // Auto-ocultar mensajes de éxito después de un tiempo más largo
    if (type === 'success') {
        setTimeout(() => {
            if (elements.messageArea1.contains(messageElement)) {
                elements.messageArea1.removeChild(messageElement);
            }
        }, 6000);
    }
}

/**
 * Muestra un mensaje en el área de resultados
 */
function showResultMessage(message, type = 'info') {
    const messageElement = document.createElement('div');
    messageElement.className = `message message--${type}`;
    
    const icon = getMessageIcon(type);
    messageElement.innerHTML = `${icon} ${message}`;
    
    elements.sendResultsMessage.innerHTML = '';
    elements.sendResultsMessage.appendChild(messageElement);
    
    // Auto-ocultar mensajes después de un tiempo
    setTimeout(() => {
        if (elements.sendResultsMessage.contains(messageElement)) {
            elements.sendResultsMessage.removeChild(messageElement);
        }
    }, 5000);
}

/**
 * Obtiene el icono para el tipo de mensaje
 */
function getMessageIcon(type) {
    switch (type) {
        case 'success':
            return '<span style="color: var(--color-success);">✓</span>';
        case 'error':
            return '<span style="color: var(--color-error);">✗</span>';
        case 'warning':
            return '<span style="color: var(--color-warning);">⚠</span>';
        case 'info':
        default:
            return '<span style="color: var(--color-info);">ℹ</span>';
    }
}

/**
 * Resetea la aplicación al estado inicial
 */
function resetApplication() {
    // Resetear estado
    appState = {
        currentPage: 1,
        userData: {
            nombre: '',
            apellido: ''
        },
        dataSubmitted: false,
        selectedSection: null,
        scores: {
            pasados: {
                exercise1: 0,
                exercise2: 0,
                total: 0,
                completed: false
            },
            futuro: {
                exercise1: 0,
                exercise2: 0,
                total: 0,
                completed: false
            }
        },
        results: {
            pasados: {
                exercise1: [],
                exercise2: []
            },
            futuro: {
                exercise1: [],
                exercise2: []
            }
        }
    };
    
    // Limpiar formularios
    elements.personalDataForm.reset();
    elements.exercisePasados1Form.reset();
    elements.exercisePasados2Form.reset();
    elements.exerciseFuturo1Form.reset();
    elements.exerciseFuturo2Form.reset();
    
    // Resetear visualización de ejercicios
    resetExerciseVisuals();
    
    // Volver a la primera página
    goToPage('page1');
    
    // Limpiar mensajes
    elements.messageArea1.innerHTML = '';
    elements.sendResultsMessage.innerHTML = '';
    
    // Mostrar mensaje inicial
    showMessage('Completa tus datos personales y selecciona los ejercicios que deseas realizar.', 'info');
    
    // Enfocar primer campo
    elements.nombreInput.focus();
}

/**
 * Resetea los visuales de los ejercicios
 */
function resetExerciseVisuals() {
    // Resetear botones de selección
    document.querySelectorAll('.btn--selection').forEach(btn => {
        btn.classList.remove('btn--selection--selected');
    });
    
    // Resetear ejercicios de pasados
    resetSectionVisuals('pasados');
    
    // Resetear ejercicios de futuro
    resetSectionVisuals('futuro');
}

/**
 * Resetea los visuales de una sección específica
 */
function resetSectionVisuals(section) {
    const pagePrefix = section === 'pasados' ? 'page2' : 'page4';
    const page3Prefix = section === 'pasados' ? 'page3' : 'page5';
    
    // Resetear ejercicio 1 (multiple choice)
    const page1 = document.getElementById(pagePrefix);
    if (page1) {
        const options = page1.querySelectorAll('.option-label');
        options.forEach(option => {
            option.classList.remove('option-label--correct', 'option-label--incorrect', 'option-label--selected');
            option.querySelector('input').disabled = false;
        });
    }
    
    // Resetear ejercicio 2 (fill gaps)
    const page2 = document.getElementById(page3Prefix);
    if (page2) {
        const inputs = page2.querySelectorAll('.gap-input');
        inputs.forEach(input => {
            input.classList.remove('gap-input--correct', 'gap-input--incorrect');
            input.disabled = false;
            input.value = '';
        });
    }
    
    // Resetear elementos de resultados y botones
    const capitalizedSection = section.charAt(0).toUpperCase() + section.slice(1);
    
    // Ocultar resultados
    elements[`exercise${capitalizedSection}1Results`]?.classList.add('hidden');
    elements[`exercise${capitalizedSection}2Results`]?.classList.add('hidden');
    
    // Mostrar botones de envío y ocultar botones de continuar
    const form1 = elements[`exercise${capitalizedSection}1Form`];
    const form2 = elements[`exercise${capitalizedSection}2Form`];
    
    if (form1) {
        const submitBtn1 = form1.querySelector('button[type="submit"]');
        if (submitBtn1) submitBtn1.classList.remove('hidden');
    }
    
    if (form2) {
        const submitBtn2 = form2.querySelector('button[type="submit"]');
        if (submitBtn2) submitBtn2.classList.remove('hidden');
    }
    
    // Ocultar botones de continuar
    if (section === 'pasados') {
        elements.continueToPasados2?.classList.add('hidden');
        elements.goToFuturoFromPasados?.classList.add('hidden');
    } else {
        elements.continueToFuturo2?.classList.add('hidden');
        elements.goToFinalResults?.classList.add('hidden');
    }
}

// Permitir navegación con teclado
document.addEventListener('keydown', (e) => {
    // Escape para mostrar confirmación de reinicio
    if (e.key === 'Escape' && appState.currentPage > 1) {
        if (confirm('¿Estás seguro de que quieres reiniciar los ejercicios?')) {
            resetApplication();
        }
    }
});

function clearPersonalDataErrors() {
    elements.messageArea1.innerHTML = '';
}