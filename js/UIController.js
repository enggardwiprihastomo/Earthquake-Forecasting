var UIController = (() => {
    var DOM = {
        body : window.document.querySelector('body'),
        menus: window.document.querySelector('.menus'),
        saveModel: window.document.querySelector('.main-save-model'),
        mainLoader: window.document.querySelector('.main-loader'),
        mainWrapper: window.document.querySelector('.main-wrapper'),
        networkWrapper: window.document.querySelector('.network-wrapper'),
        networkInfo: window.document.querySelector('.network-info'),
        resultWrapper: window.document.querySelector('.result-wrapper'),
        detailWrapper: window.document.querySelector('.detail-wrapper'),
        testWrapper: window.document.querySelector('.test-wrapper'),
        mapWrapper: window.document.querySelector('.map-wrapper'),
        chartWrapper: window.document.querySelector('.chart-wrapper'),
        inputWrapper: window.document.querySelector('.input-wrapper'),
        inputDate: window.document.querySelector('.date-predict'),
        hiddenWrapper: window.document.querySelector('.hidden-wrapper'),
        outputWrapper: window.document.querySelector('.output-wrapper'),
        messageWrapper: window.document.querySelector('.message-wrapper'),
        btnMenu : window.document.querySelector('.btn-menu'),
        btnLayer: window.document.querySelector('.btn-layer'),
        btnSubmit: window.document.querySelector('.btn-submit'),
        btnTraining: window.document.querySelector('.btn-training'),
        btnTest: window.document.querySelector('.btn-test'),
        btnPredict: window.document.querySelector('.btn-predict'),
        btnBack: window.document.querySelector('.btn-back'),
        btnBackDetail: window.document.querySelector('.btn-back-detail'),
        btnBackTest: window.document.querySelector('.btn-back-test'),
        btnBackMap: window.document.querySelector('.btn-back-map'),
        btnMap: window.document.querySelector('.btn-map-input'),
        mainLeft: window.document.querySelector('.main-left'),
        networks: window.document.querySelectorAll('#network'),
        fileTraining: window.document.querySelector('.file-training'),
        labelLoadModel: window.document.getElementById('label-load-model'),
        labelSaveModel: window.document.getElementById('label-save-model'),
        fileModel: window.document.querySelectorAll('.file-model'),
        inputInfo: window.document.getElementById('inputNeurons'),
        hiddenInfo: window.document.getElementById('hiddenNeurons'),
        outputInfo: window.document.getElementById('outputNeurons'),
        dataInfo: window.document.getElementById('trainingData'),
        neuronDesc: window.document.getElementById('neuron-desc')
    };

    var getHidden = () => {
        var hiddens =  window.document.querySelectorAll('.input-hidden'),
        hidden = {
            activations: [],
            neurons: []
        };
        hiddens.forEach((element) => {
            if(element.value != 0 && element.value != null && element.value != undefined && element.value != ''){
                hidden.activations.push('sigmoid');
                hidden.neurons.push(parseFloat(element.value));
            }
        });

        return hidden;
    };

    return {
        DOM: DOM,
        displayDOM: (obj, type = 'block') => {
            obj.style.display = type;
        },
        hideDOM: (obj) => {
            obj.style.display = 'none';
        },
        isHidden: (obj) => {
            if(obj.style.display == 'none' || obj.style.display == ''){
                return true;
            }
            else{
                return false;
            }
        },
        isDisplayed: (obj) => {
            if(obj.style.display != 'none' && obj.style.display != ''){
                return true;
            }
            else{
                return false;
            }
        },
        createLoader: () => {
            var wrapper = document.createElement('div'),
            blue = document.createElement('div'),
            green = document.createElement('div'),
            yellow = document.createElement('div'),
            gray = document.createElement('div');
            wrapper.classList.add('loading-wrapper');
            blue.classList.add('loading-blue');
            green.classList.add('loading-green');
            yellow.classList.add('loading-yellow');
            gray.classList.add('loading-gray');
            wrapper.appendChild(blue);
            wrapper.appendChild(green);
            wrapper.appendChild(yellow);
            wrapper.appendChild(gray);
            DOM.body.appendChild(wrapper);
        },
        deleteLoader: () => {
            if(document.querySelector('.loading-wrapper')){
                document.querySelector('.loading-wrapper').remove();
            }
        },
        getHidden: () => {
            return getHidden()
        },
        displayMessage: (data, type = 'normal') => {
            var message = window.document.createElement('div'),
            messageType = window.document.createElement('span'),
            messageContent = window.document.createElement('span');
            message.classList.add('message');
            messageType.classList.add('message-type');
            messageContent.classList.add('message-content');

            if(type == 'error'){
                messageType.style.color = '#EB5959';
                messageType.textContent = type.toUpperCase();
            }
            else{
                messageType.textContent = 'MESSAGE';
            }
            messageContent.textContent = data;
            message.appendChild(messageType);
            message.appendChild(messageContent);
            DOM.messageWrapper.appendChild(message);

            setTimeout(function(){
                message.style.transform = 'translateX(-50px) scale(1.5)';
                message.style.opacity = 0;
                setTimeout(function(){
                    DOM.messageWrapper.removeChild(DOM.messageWrapper.firstElementChild);
                },250);
            }, 5000);
        }
    }
})();