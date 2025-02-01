// Inicializar participantes desde localStorage
let participants = JSON.parse(localStorage.getItem('participants')) || [];
let editMode = false;
let deleteMode = false;

// Lista de nombres excluidos (sin distinguir mayúsculas ni tildes)
const excludedParticipants = ["angel barrera"].map(name => name.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase());

function addParticipant() {
    const nameInput = document.getElementById('name');
    let name = nameInput.value.trim(); // Eliminar espacios innecesarios
    
    if (!name) {
        alert("Por favor, ingresa un nombre.");
        return;
    }
    
    let normalizedName = name.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
    if (excludedParticipants.includes(normalizedName)) {
        alert("Este participante está excluido del sorteo.");
        return;
    }
    
    participants.push(name);
    saveParticipants();
    updateParticipantsList();
    nameInput.value = ''; // Limpiar el campo de entrada
}

function updateParticipantsList() {
    const list = document.getElementById('participantsList');
    list.innerHTML = '';

    participants.forEach((participant, index) => {
        const li = document.createElement('li');
        li.textContent = participant;
        
        const actions = document.createElement('div');
        actions.className = 'actions'; // Clase para estilos adicionales

        const editBtn = document.createElement('button');
        editBtn.innerHTML = '<i class="fas fa-edit"></i>';
        editBtn.onclick = () => editParticipant(index);
        actions.appendChild(editBtn);
        
        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
        deleteBtn.onclick = () => deleteParticipant(index);
        actions.appendChild(deleteBtn);
        
        li.appendChild(actions);
        list.appendChild(li);
    });
}

function saveParticipants() {
    try {
        localStorage.setItem('participants', JSON.stringify(participants));
    } catch (error) {
        alert("Error al guardar los participantes. Verifica que tu navegador permita el uso de localStorage.");
    }
}

function clearParticipants() {
    if (confirm("¿Estás seguro de que quieres eliminar a todos los participantes?")) {
        participants = [];
        saveParticipants();
        updateParticipantsList();
    }
}

function pickWinner() {
    if (participants.length === 0) {
        alert('No hay participantes para elegir.');
        return;
    }

    const digitalBoard = document.getElementById('digitalBoard');
    let displayedParticipants = shuffleArray([...participants]);
    let currentIndex = 0;
    const speed = 100;
    const duration = 5000;

    digitalBoard.classList.remove('winner');

    const interval = setInterval(() => {
        digitalBoard.textContent = displayedParticipants[currentIndex];
        currentIndex = (currentIndex + 1) % displayedParticipants.length;
    }, speed);

    setTimeout(() => {
        clearInterval(interval);
        let winner;
        do {
            winner = participants[Math.floor(Math.random() * participants.length)];
        } while (excludedParticipants.includes(winner.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()));

        digitalBoard.textContent = `¡El ganador es: ${winner}!`;
        digitalBoard.classList.add('winner');
    }, duration);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function editParticipant(index) {
    const newName = prompt('Ingresa el nuevo nombre:', participants[index]);
    if (newName) {
        participants[index] = newName.trim();
        saveParticipants();
        updateParticipantsList();
    }
}

function deleteParticipant(index) {
    if (confirm(`¿Estás seguro de que quieres eliminar a ${participants[index]}?`)) {
        participants.splice(index, 1);
        saveParticipants();
        updateParticipantsList();
    }
}

window.onload = () => {
    updateParticipantsList();
};
