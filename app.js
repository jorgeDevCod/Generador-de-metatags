document.addEventListener('DOMContentLoaded', () => {
    // Character counter event listeners
    const characterCounterFields = [
        'title', 'description',
        'ogTitle', 'ogDescription',
        'twitterTitle', 'twitterDescription',
        'ogSiteName'
    ];

    characterCounterFields.forEach(field => {
        const inputField = document.getElementById(field);
        inputField.addEventListener('input', () => updateCharCounter(field));
    });

    // Image URL validation
    const imageUrlFields = ['ogImage', 'twitterImage', 'favicon'];
    imageUrlFields.forEach(field => {
        const inputField = document.getElementById(field);
        inputField.addEventListener('blur', () => validateImageUrl(field));
    });

    // URL validation
    const urlFields = ['canonical', 'ogUrl'];
    urlFields.forEach(field => {
        const inputField = document.getElementById(field);
        inputField.addEventListener('blur', () => validateUrl(field));
    });
});


// Función para actualizar el contador de caracteres
function updateCharCounter(field) {
    const inputField = document.getElementById(field);
    const charCounter = document.getElementById(`${field}Counter`);
    const maxLength = {
        'title': 60,
        'description': 150,
        'ogTitle': 70,
        'ogDescription': 160,
        'twitterTitle': 70,
        'twitterDescription': 160,
        'ogSiteName': 20
    }[field];

    const currentLength = inputField.value.length;
    charCounter.innerText = `${currentLength}/${maxLength} caracteres`;

    // Validar longitud
    if (currentLength > maxLength) {
        charCounter.classList.add('error');
        inputField.classList.add('error');
    } else {
        charCounter.classList.remove('error');
        inputField.classList.remove('error');
    }
}

// Función para validar la URL de la imagen
function validateImageUrl(fieldId) {
    const imageUrl = document.getElementById(fieldId).value;
    const errorMessage = document.getElementById(`${fieldId}Error`);

    // Comprobar si la URL es válida
    if (imageUrl && !imageUrl.match(/\.(jpeg|jpg|gif|png|svg|ico)$/i)) {
        errorMessage.innerText = 'Por favor, ingresa una URL de imagen válida.';
        return false;
    } else {
        errorMessage.innerText = '';
        return true;
    }
}

// Función para validar cualquier URL
function validateUrl(fieldId) {
    const url = document.getElementById(fieldId).value;
    const errorMessage = document.getElementById(`${fieldId}Error`);

    // Comprobar si la URL tiene un dominio
    const urlPattern = /^(http|https):\/\/[^\s$.?#].[^\s]*$/;
    if (url && !urlPattern.test(url)) {
        errorMessage.innerText = 'Ingresa una URL correcta.';
        return false;
    } else {
        errorMessage.innerText = '';
        return true;
    }
}

// Función para generar las etiquetas meta
function generateMetaTags() {
    // Validar todos los campos antes de generar
    const fieldsToValidate = [
        { id: 'canonical', validator: validateUrl },
        { id: 'ogImage', validator: validateImageUrl },
        { id: 'twitterImage', validator: validateImageUrl },
        { id: 'favicon', validator: validateImageUrl }
    ];

    let isValid = true;
    fieldsToValidate.forEach(field => {
        if (!field.validator(field.id)) {
            isValid = false;
        }
    });

    if (!isValid) {
        alert('Por favor, corrige los errores antes de generar los meta tags.');
        return;
    }

    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const canonical = document.getElementById("canonical").value;
    const favicon = document.getElementById("favicon").value;
    const faviconType = favicon ? favicon.split('.').pop() : '';
    const ogType = document.getElementById("ogType").value;
    const ogSiteName = document.getElementById("ogSiteName").value;
    const ogUrl = document.getElementById("ogUrl").value;
    const ogImage = document.getElementById("ogImage").value;
    const ogTitle = document.getElementById("ogTitle").value;
    const ogDescription = document.getElementById("ogDescription").value;
    const twitterTitle = document.getElementById("twitterTitle").value;
    const twitterDescription = document.getElementById("twitterDescription").value;
    const twitterImage = document.getElementById("twitterImage").value;
    const noindex = document.getElementById("noindex").checked;
    const nofollow = document.getElementById("nofollow").checked;

    let metaTags = '';

    // Generar meta tags con viñetas
    if (title) metaTags += `<li>&lt;title&gt;${escapeHtml(title)}&lt;/title&gt;</li>\n`;
    if (description) metaTags += `<li>&lt;meta name="description" content="${escapeHtml(description)}"&gt;</li>\n`;
    if (canonical) metaTags += `<li>&lt;link rel="canonical" href="${escapeHtml(canonical)}"&gt;</li>\n`;
    if (favicon) metaTags += `<li>&lt;link rel="icon" href="${escapeHtml(favicon)}" type="image/${faviconType}"&gt;</li>\n`;

    // Open Graph Tags
    if (ogType) metaTags += `<li>&lt;meta property="og:type" content="${escapeHtml(ogType)}"&gt;</li>\n`;
    if (ogSiteName) metaTags += `<li>&lt;meta property="og:site_name" content="${escapeHtml(ogSiteName)}"&gt;</li>\n`;
    if (ogUrl) metaTags += `<li>&lt;meta property="og:url" content="${escapeHtml(ogUrl)}"&gt;</li>\n`;
    if (ogImage) metaTags += `<li>&lt;meta property="og:image" content="${escapeHtml(ogImage)}"&gt;</li>\n`;
    if (ogTitle) metaTags += `<li>&lt;meta property="og:title" content="${escapeHtml(ogTitle)}"&gt;</li>\n`;
    if (ogDescription) metaTags += `<li>&lt;meta property="og:description" content="${escapeHtml(ogDescription)}"&gt;</li>\n`;

    // Twitter Card
    if (twitterTitle || twitterDescription || twitterImage) {
        metaTags += `<li>&lt;meta name="twitter:card" content="summary_large_image"&gt;</li>\n`;
    }
    if (twitterTitle) metaTags += `<li>&lt;meta name="twitter:title" content="${escapeHtml(twitterTitle)}"&gt;</li>\n`;
    if (twitterDescription) metaTags += `<li>&lt;meta name="twitter:description" content="${escapeHtml(twitterDescription)}"&gt;</li>\n`;
    if (twitterImage) metaTags += `<li>&lt;meta name="twitter:image" content="${escapeHtml(twitterImage)}"&gt;</li>\n`;

    // Robots Meta Tag
    const robotsContent = [];
    if (noindex) robotsContent.push('noindex');
    if (nofollow) robotsContent.push('nofollow');
    if (robotsContent.length > 0) {
        metaTags += `<li>&lt;meta name="robots" content="${robotsContent.join(', ')}"&gt;</li>\n`;
    }

    // Mostrar resultados en viñetas
    const outputContainer = document.getElementById("outputContainer");
    const outputTags = document.getElementById("outputTags");
    outputTags.innerHTML = `<ul>${metaTags}</ul>`;

    // Asegúrate de que el contenedor esté visible
    outputContainer.style.display = 'block';
}

// Función para copiar meta tags
function copyMetaTags() {
    const outputTags = document.getElementById("outputTags");
    const metaTagsText = outputTags.innerText;

    navigator.clipboard.writeText(metaTagsText).then(() => {
        alert('Meta tags copiados al portapapeles');
    }).catch(err => {
        console.error('Error al copiar los meta tags: ', err);
        alert('No se pudieron copiar los meta tags');
    });
}

// Función para exportar a Word (simulada)
function exportToWord() {
    const outputTags = document.getElementById("outputTags");
    const metaTagsText = outputTags.innerText;

    // Crear un elemento temporal para generar el archivo
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(metaTagsText));
    element.setAttribute('download', 'meta-tags.doc');

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}
// Funciones adicionales para eliminar campos
function deleteField(fieldId) {
    const field = document.getElementById(fieldId);
    const counterField = document.getElementById(`${fieldId}Counter`);

    // Limpiar el campo
    if (field.tagName === 'TEXTAREA' || field.tagName === 'INPUT') {
        field.value = '';

        // Disparar evento de entrada para actualizar contadores
        const event = new Event('input', { bubbles: true });
        field.dispatchEvent(event);
    }
}

function deleteAllFields() {
    const fieldsToDelete = [
        'title', 'description', 'canonical', 'favicon',
        'ogSiteName', 'ogType', 'ogUrl', 'ogImage', 'ogTitle',
        'ogDescription', 'twitterImage', 'twitterTitle',
        'twitterDescription'
    ];

    fieldsToDelete.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.value = '';

            // Disparar evento de entrada para actualizar contadores
            const event = new Event('input', { bubbles: true });
            field.dispatchEvent(event);
        }
    });

    // Desmarcar checkboxes
    const checkboxes = ['noindex', 'nofollow'];
    checkboxes.forEach(checkboxId => {
        const checkbox = document.getElementById(checkboxId);
        if (checkbox) {
            checkbox.checked = false;
        }
    });

    // Ocultar el contenedor de salida
    const outputContainer = document.getElementById('outputContainer');
    if (outputContainer) {
        outputContainer.style.display = 'none';
    }
}
// Función para escapar HTML y prevenir inyección
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}