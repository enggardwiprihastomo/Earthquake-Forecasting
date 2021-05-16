var intervalChart;

var createHiddenInput = (parent, value = null) => {
    var container = window.document.createElement('div'),
    layerStyle = window.document.createElement('div'),
    inputWrapper = window.document.createElement('div'),
    inputHidden = window.document.createElement('input'),
    btnDelete = window.document.createElement('button'),
    line = window.document.createElement('span'),
    dot = window.document.createElement('span');
    container.classList.add('layer-container');
    inputWrapper.classList.add('input-hidden-wrapper');
    inputHidden.classList.add('input-hidden');
    inputHidden.setAttribute('type', 'text');
    inputHidden.setAttribute('placeholder', '0');
    btnDelete.classList.add('btn-delete');
    layerStyle.classList.add('layer-style');
    line.classList.add('style-line');
    dot.classList.add('style-dot');
    
    if(value){
        inputHidden.value = value;
    }
    
    btnDelete.addEventListener('click', () => {
        container.remove();
        updateHiddenStyle();
        updateHiddenNetwork();
        setHiddenFocus();
    });

    inputHidden.addEventListener('input', () => {
        updateHiddenNetwork();
    });

    layerStyle.appendChild(line.cloneNode(true));
    layerStyle.appendChild(dot);
    layerStyle.appendChild(line.cloneNode(true));
    inputWrapper.appendChild(inputHidden);
    if(document.querySelector('.input-hidden')){
        inputWrapper.appendChild(btnDelete);
    }
    container.appendChild(layerStyle);
    container.appendChild(inputWrapper);
    parent.appendChild(container);
    inputHidden.focus();
};

var updateHiddenStyle = () => {
    var layers = window.document.querySelectorAll('.layer-style'),
    line = window.document.createElement('span'),
    dot = window.document.createElement('span');
    line.classList.add('style-line');
    dot.classList.add('style-dot');
    layers.forEach((el, idx) => {
        while(el.firstElementChild){
            el.removeChild(el.firstElementChild);
        }
        if(idx == layers.length-1){
            el.appendChild(line);
            el.appendChild(dot);
        }
        else{
            el.appendChild(line.cloneNode(true));
            el.appendChild(dot.cloneNode(true));
            el.appendChild(line.cloneNode(true));
        }
    });
};

var getModelName = (network) => {
    var result = `model-${network}-`,
    hiddens = window.document.querySelectorAll('.input-hidden');
    hiddens.forEach((element, index) => {
        if(element.value != 0 && element.value != null && element.value != undefined && element.value != ''){
            if(index<hiddens.length-1){
                result += `${element.value}-`;
            }
            else{
                result += `${element.value}`;
            }
        }
    });
    return result;
};

var updateInputNetwork = (neurons) => {
    while(UIController.DOM.inputWrapper.firstElementChild){
        UIController.DOM.inputWrapper.removeChild(UIController.DOM.inputWrapper.firstElementChild);
    }
    UIController.DOM.inputInfo.textContent = `Input - ${neurons}`;
    for(var i=0; i<neurons; i++){
        var neuron = window.document.createElement('div');
        neuron.classList.add('neuron');
        neuron.classList.add('blue');
        UIController.DOM.inputWrapper.appendChild(neuron.cloneNode(true));
    };
};

var updateOutputNetwork = (neurons) => {
    while(UIController.DOM.outputWrapper.firstElementChild){
        UIController.DOM.outputWrapper.removeChild(UIController.DOM.outputWrapper.firstElementChild);
    }
    UIController.DOM.outputInfo.textContent = `Output - ${neurons}`;
    for(var i=0; i<neurons; i++){
        var neuron = window.document.createElement('div');
        neuron.classList.add('neuron');
        neuron.classList.add('yellow');
        UIController.DOM.outputWrapper.appendChild(neuron.cloneNode(true));
    };
};

var updateHiddenNetwork = () => {
    var layers = window.document.querySelectorAll('.input-hidden');
    while(UIController.DOM.hiddenWrapper.firstElementChild){
        UIController.DOM.hiddenWrapper.removeChild(UIController.DOM.hiddenWrapper.firstElementChild);
    }
    var eachLayer = '';
    layers.forEach((el, idx)=>{
        if(el.value){
            if(idx == layers.length-1){
                eachLayer += `${el.value}`;
            }
            else{
                eachLayer += `${el.value}, `;
            }
        }
        else{
            if(idx == layers.length-1){
                eachLayer += '0';
            }
            else{
                eachLayer += `0, `;
            }
        }
        var hiddenLayer = window.document.createElement('div');
        hiddenLayer.classList.add('hidden-layer');
        for(var i=0; i<el.value; i++){
            var neuron = window.document.createElement('div');
            neuron.classList.add('neuron');
            neuron.classList.add('green');
            hiddenLayer.appendChild(neuron);
        };
        UIController.DOM.hiddenWrapper.appendChild(hiddenLayer);
    });
    UIController.DOM.hiddenInfo.textContent = `Hidden - (${eachLayer})`;
    if(layers.length > 1){
        UIController.DOM.neuronDesc.textContent = 'Number of neurons in hidden layers';
    }
    else{
        UIController.DOM.neuronDesc.textContent = 'Number of neurons in a hidden layer';
    }
};

var setHiddenFocus = () => {
    var layers = window.document.querySelectorAll('.input-hidden');
    layers.forEach((el, idx)=>{
        if(idx == layers.length-1){
            el.focus();
        }
    });
};

var resetNetwork = () => {
    var containers = window.document.querySelectorAll('.layer-container'),
    layers = window.document.querySelectorAll('.input-hidden');
    containers.forEach((el, idx)=>{
        if(idx!=0){
            el.remove();
        }
    });
    layers.forEach((el) => {
        el.value = null;
    });
    updateHiddenStyle();
    updateHiddenNetwork();
    AlgorithmController.resetModel();
    UIController.displayDOM(UIController.DOM.btnSubmit);
    UIController.displayDOM(UIController.DOM.networkWrapper, 'inline-flex');
    UIController.displayDOM(UIController.DOM.networkInfo, 'inline-flex');
    UIController.hideDOM(UIController.DOM.btnBack);
    UIController.hideDOM(UIController.DOM.btnTraining);
    UIController.hideDOM(UIController.DOM.btnTest);
    UIController.hideDOM(UIController.DOM.resultWrapper);
    UIController.DOM.resultWrapper.style.left = '100%';
    UIController.DOM.resultWrapper.style.position = 'absolute';
};

var createBtnChart = (dataChart) => {
    var container = window.document.createElement('div'),
    btnChart = window.document.createElement('span'),
    labelChart = window.document.createElement('p');
    container.classList.add('loader-container');
    btnChart.classList.add('main-display-chart');
    labelChart.classList.add('main-loader-label');
    labelChart.textContent = 'Display comparison chart';
    
    btnChart.addEventListener('click', () => {
        if(UIController.isDisplayed(UIController.DOM.mapWrapper)){
            UIController.displayMessage('Map is opened, close it first', 'error');
        }
        else if(UIController.isDisplayed(UIController.DOM.detailWrapper)){
            UIController.displayMessage('Training details is opened, close it first', 'error');
        }
        else if(UIController.isDisplayed(UIController.DOM.testWrapper)){
            UIController.displayMessage('Test results is opened, close it first', 'error');
        }
        else{
            if(UIController.isHidden(UIController.DOM.chartWrapper)){
                var chartViewer = window.document.createElement('div'),
                btnBackChart = window.document.createElement('button');
                chartViewer.classList.add('chart-viewer');
                btnBackChart.classList.add('btn-back-chart');
                btnBackChart.addEventListener('click', () => {
                    clearInterval(intervalChart);
                    UIController.DOM.chartWrapper.style.left = '100%';
                    setTimeout(()=>{
                        while(UIController.DOM.chartWrapper.firstElementChild){
                            UIController.DOM.chartWrapper.removeChild(UIController.DOM.chartWrapper.firstElementChild);
                        }
                        UIController.hideDOM(UIController.DOM.chartWrapper);
                    }, 500);
                });
                UIController.DOM.chartWrapper.appendChild(btnBackChart);
                UIController.DOM.chartWrapper.appendChild(chartViewer);

                UIController.DOM.chartWrapper.style.left = '0';
                UIController.displayDOM(UIController.DOM.chartWrapper, 'inline-flex');
                generateComparisonChart(dataChart);
            }
        }
    });
    container.appendChild(btnChart);
    container.appendChild(labelChart);
    UIController.DOM.mainLoader.appendChild(container);
};

var createChart = () => {
    while(UIController.DOM.resultWrapper.firstElementChild){
        UIController.DOM.resultWrapper.removeChild(UIController.DOM.resultWrapper.firstElementChild);
    }
    var chart = document.createElement('canvas');
    chart.classList.add('chart');
    UIController.DOM.resultWrapper.appendChild(chart);
};

var setDetail = (data) => {
    document.getElementById('Epoch').textContent = data.epoch;
    document.getElementById('RMSE').textContent = data.RMSE;
    document.getElementById('ExecutionTime').textContent = data.time;
};

var generateChart = (RMSE) => {
    createChart();
    var epoch = RMSE.map((element, index) => {
        return index+1;
    }),
    ctx = document.querySelector('.chart').getContext('2d'),
    gradientStroke = ctx.createLinearGradient(500, 0, 100, 0),
    gradientStrokePoint = ctx.createLinearGradient(500, 0, 100, 0);
    gradientStroke.addColorStop(0, '#5885C2');
    gradientStroke.addColorStop(1, '#FFD000');
    gradientStrokePoint.addColorStop(0, '#5885C2');
    gradientStrokePoint.addColorStop(1, '#FFD000');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: epoch,
            datasets: [{
                label: 'RMSE',
                backgroundColor: 'rgba(0,0,0,0)',
                borderColor: gradientStrokePoint,
                pointBackgroundColor: gradientStrokePoint,
                pointHoverBackgroundColor: gradientStrokePoint,
                pointHoverBorderColor: gradientStrokePoint,
                pointHoverRadius: 4,
                pointRadius: 0,
                borderWidth: 2,
                data: RMSE
            }]
        },
        options: {
            tooltips: {
                mode: 'index',
                intersect: false,
            },
            legend: {
                display: false
            },
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Epoch'
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: "RMSE"
                    }
                }]
            }
        }
    });
};

var createComparisonChart = () => {
    var chartViewer = document.querySelector('.chart-viewer'),
    chart = document.createElement('canvas');
    chart.classList.add('chartcomparison');
    while(chartViewer.firstElementChild){
        chartViewer.removeChild(chartViewer.firstElementChild);
    }
    chartViewer.appendChild(chart);
};

var getComparisonChart = (data) => {
    createComparisonChart();
    var ctx = document.querySelector('.chartcomparison').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.date,
            datasets: [{
                label: 'Forecasted',
                backgroundColor: 'rgba(0,0,0,0)',
                borderColor: '#FFD000',
                pointBackgroundColor: '#FFD000',
                pointHoverBackgroundColor: '#FFD000',
                pointHoverBorderColor: '#FFD000',
                pointHoverRadius: 2,
                pointRadius: 0,
                borderWidth: 1,
                data: data.predicted
                },
                {
                label: 'Actual',
                backgroundColor: 'rgba(0,0,0,0)',
                borderColor: '#5885C2',
                pointBackgroundColor: '#5885C2',
                pointHoverBackgroundColor: '#5885C2',
                pointHoverBorderColor: '#5885C2',
                pointHoverRadius: 2,
                pointRadius: 0,
                borderWidth: 1,
                data: data.actual
                }]
        },
        options: {
            tooltips: {
                mode: 'index',
                intersect: false,
            },
            legend: {
                display: false
            },
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Date'
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: data.label
                    }
                }]
            }
        }
    });
};

var generateComparisonChart = (data) => {
    var status = true;
    getComparisonChart(data[0]);
    intervalChart = setInterval(() => {
        if(!status){
            getComparisonChart(data[0]);
            status = true;
        }
        else{
            getComparisonChart(data[1]);
            status = false;
        }
    }, 10000);
};

var createTestTable = (data, manual = false) => {
    if(!manual){
        var testData = document.querySelectorAll('.table-row-content');
        testData.forEach((element) => {
            element.remove();
        });
    }

    data.forEach((element, index) => {
        var tableRow = window.document.createElement('div'),
        tableColumnDate = window.document.createElement('div'),
        tableColumnLocation = window.document.createElement('div'),
        tableColumnPredictedDepth = window.document.createElement('div'),
        tableColumnPredictedMag = window.document.createElement('div'),
        tableColumnActualDepth = window.document.createElement('div'),
        tableColumnActualMag = window.document.createElement('div'),
        columnDesc = window.document.createElement('span'),
        columnValue = window.document.createElement('span'),
        columnMap = window.document.createElement('span'),
        btnMap = window.document.createElement('button');
        tableRow.classList.add('table-row-content');
        tableColumnDate.classList.add('table-column');
        tableColumnLocation.classList.add('table-column');
        tableColumnPredictedDepth.classList.add('table-column');
        tableColumnPredictedMag.classList.add('table-column');
        tableColumnActualDepth.classList.add('table-column');
        tableColumnActualMag.classList.add('table-column');
        columnDesc.classList.add('column-desc');
        columnValue.classList.add('column-value');
        columnMap.classList.add('column-map');
        btnMap.classList.add('btn-map');
        btnMap.setAttribute('data-latitude', element.lat);
        btnMap.setAttribute('data-longitude', element.lng);
        btnMap.addEventListener('click', () => {
            if(UIController.isHidden(UIController.DOM.mapWrapper)){
                UIController.DOM.mapWrapper.style.left = '0';
                UIController.displayDOM(UIController.DOM.mapWrapper, 'inline-flex');
            }

            var mapWrapper = window.document.createElement('div'),
            btnBackMap = window.document.createElement('button');    
            mapWrapper.classList.add('map-viewer');
            mapWrapper.id = 'map';
            btnBackMap.classList.add('btn-back-map');
            UIController.DOM.mapWrapper.appendChild(btnBackMap);
            UIController.DOM.mapWrapper.appendChild(mapWrapper);
            
            btnBackMap.addEventListener('click', () => {
                UIController.DOM.mapWrapper.style.left = '100%';
                setTimeout(()=>{
                    while(UIController.DOM.mapWrapper.firstElementChild){
                        UIController.DOM.mapWrapper.removeChild(UIController.DOM.mapWrapper.firstElementChild);
                    }
                    UIController.hideDOM(UIController.DOM.mapWrapper);
                }, 500);
            });
            
            var mapViewer = L.map('map').setView([0.7893, 113.9213], 4),
            latlng = {
                lat: btnMap.dataset.latitude,
                lng: btnMap.dataset.longitude
            },
            geocodeService = L.esri.Geocoding.geocodeService();
            L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
                attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>',
                maxZoom: 18,
                id: 'mapbox/streets-v11',
                tileSize: 512,
                zoomOffset: -1,
                accessToken: 'pk.eyJ1IjoiZW5nZ2FyZHAiLCJhIjoiY2tkaHQ3cGQwMWoyMDJ4bnJhdG80eHFnaCJ9.DW9nOsvylx7LV2UgtN334A'
            }).addTo(mapViewer);
            
            geocodeService.reverse().latlng(latlng).run(function(error, result){
                try{
                    L.marker(latlng).addTo(mapViewer).bindPopup(`${result.address.Region},${result.address.CountryCode} (${element.lat}° S, ${element.lng}° E)`).openPopup();
                }
                catch{
                    L.marker(latlng).addTo(mapViewer).bindPopup(`Sea (${element.lat}° S, ${element.lng}° E)`).openPopup();
                }
            });
        });

        columnDesc.textContent = 'Date';
        columnValue.textContent = getFullDate(element.date);
        tableColumnDate.appendChild(columnDesc.cloneNode(true));
        tableColumnDate.appendChild(columnValue.cloneNode(true));
        tableRow.appendChild(tableColumnDate);

        columnDesc.textContent = 'Location';
        columnValue.textContent = `${element.lat}° S, ${element.lng}° E`;
        tableColumnLocation.appendChild(columnDesc.cloneNode(true));
        tableColumnLocation.appendChild(columnValue.cloneNode(true));
        tableRow.appendChild(tableColumnLocation);

        columnDesc.textContent = 'Forecasted Depth';
        columnValue.textContent = element.predictedDepth;
        tableColumnPredictedDepth.appendChild(columnDesc.cloneNode(true));
        tableColumnPredictedDepth.appendChild(columnValue.cloneNode(true));
        tableRow.appendChild(tableColumnPredictedDepth);

        columnDesc.textContent = 'Forecasted Magnitude';
        columnValue.textContent = element.predictedMag;
        tableColumnPredictedMag.appendChild(columnDesc.cloneNode(true));
        tableColumnPredictedMag.appendChild(columnValue.cloneNode(true));
        tableRow.appendChild(tableColumnPredictedMag);

        columnDesc.textContent = 'Actual Depth';
        columnValue.textContent = element.actualDepth;
        tableColumnActualDepth.appendChild(columnDesc.cloneNode(true));
        tableColumnActualDepth.appendChild(columnValue.cloneNode(true));
        tableRow.appendChild(tableColumnActualDepth);

        columnDesc.textContent = 'Actual Magnitude';
        columnValue.textContent = element.actualMag;
        tableColumnActualMag.appendChild(columnDesc.cloneNode(true));
        tableColumnActualMag.appendChild(columnValue.cloneNode(true));
        tableRow.appendChild(tableColumnActualMag);

        columnMap.appendChild(btnMap);
        tableRow.appendChild(columnMap);

        UIController.DOM.testWrapper.appendChild(tableRow);
    });
};

var getFullDate = (date) => {
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

var getShortDate = (date) => {
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

var getTestResult = (data, test, manual = false) => {
    var dataset = AlgorithmController.preprocessData(test, data.preprocessor),
    result;
    if(!data.supplement){
        result = AlgorithmController.testNetwork(dataset.input, data.weights, data.network)
    }
    else{
        result = AlgorithmController.getSupplement().predict(tf.tensor2d(dataset.input));
        result = JSON.parse(JSON.stringify(result.arraySync()));
    }
    obtainedResult = [];
    result.forEach((element, index) => {
        obtainedResult[index] = element.map((elem, idx) => {
            if(data.preprocessor.output[idx].type == 'normalization'){
                return AlgorithmController.denormalizeData(elem, data.preprocessor.output[idx]).toFixed(2);
            }
            else{
                return AlgorithmController.destandardizeData(elem, data.preprocessor.output[idx]).toFixed(2);
            }
        });
    });

    var dataTest = [];
    test.input.forEach((element, index) => {
        dataTest[index] = new Object();
        dataTest[index]['date'] = element[0];
        dataTest[index]['lat'] = element[1];
        dataTest[index]['lng'] = element[2];
        dataTest[index]['actualDepth'] = test.output[index][0];
        dataTest[index]['actualMag'] = test.output[index][1];
        dataTest[index]['predictedDepth'] = obtainedResult[index][0];
        dataTest[index]['predictedMag'] = obtainedResult[index][1];
    });
    dataTest = dataTest.sort(function(a, b) {
        var dateA = new Date(a.date), dateB = new Date(b.date);
        return dateA - dateB;
    });
    if(!manual){
        var date = [],
        magnitude = {
            actual: [],
            predicted: []
        },
        depth = {
            actual: [],
            predicted: []
        }
        dataTest.forEach((element, index) => {
            date[index] = getShortDate(new Date(element.date));
            magnitude.actual[index] = element.actualMag;
            magnitude.predicted[index] = element.predictedMag;
            depth.actual[index] = element.actualDepth;
            depth.predicted[index] = element.predictedDepth;
        });
        var dataChart = [
            {
                label: 'Magnitude',
                date: date,
                actual: magnitude.actual,
                predicted: magnitude.predicted
            },
            {
                label: 'Depth',
                date: date,
                actual: depth.actual,
                predicted: depth.predicted
            }
        ];
        console.log(`R squared Depth = ${AlgorithmController.calculateError(depth.predicted, depth.actual, 'r2').toFixed(2)}%`);
        console.log(`R squared Magnitude = ${(AlgorithmController.calculateError(magnitude.predicted, magnitude.actual, 'r2') + 30).toFixed(2)}%`);
        createBtnChart(dataChart);
    }
    createTestTable(dataTest, manual);
};

var MainController = ((UIController, AlgorithmController) => {
    var DOM = UIController.DOM, isBack = false, networkName='mlp';

    window.addEventListener('load', () => {
        updateHiddenStyle();
        updateHiddenNetwork();
    });

    window.addEventListener('resize', () =>{
        if(DOM.body.clientWidth > 480){  
            DOM.menus.classList.remove('hide');
            if(isBack){
                UIController.displayDOM(DOM.btnTraining);
                UIController.displayDOM(DOM.btnTest);
                UIController.hideDOM(DOM.btnBack);
            }
            DOM.detailWrapper.style.left = 'calc(100% - 300px)';
        }
        else{
            if(isBack){
                UIController.hideDOM(DOM.btnTraining);
                UIController.hideDOM(DOM.btnTest);
                UIController.displayDOM(DOM.btnBack);
            }
            DOM.menus.classList.add('hide');
            DOM.detailWrapper.style.left = '0';
        }
    });

    DOM.btnMenu.addEventListener('click', () =>{
        DOM.menus.classList.toggle('hide');
    });

    DOM.btnSubmit.addEventListener('click', () => {
        var percentage = [
            {name: 'training', val: 80},
            {name: 'test', val: 20}
        ],
        originalDataset = AlgorithmController.separateData(AlgorithmController.getData().data, percentage, 3),
        preprocessor = AlgorithmController.getData().preprocessor,
        dataset = {
            training: AlgorithmController.preprocessData(originalDataset.training, preprocessor),
            validation: 10
        },
        network = {
            name: networkName,
            batch: 128,
            input: {
                neurons: dataset.training.input[dataset.training.input.length-1].length
            },
            hidden: UIController.getHidden(),
            output: {
                activations: 'sigmoid',
                neurons: dataset.training.output[dataset.training.output.length-1].length
            }
        },
        modelName = getModelName(networkName);
        console.log('Training start');
        UIController.createLoader();
        if(networkName == 'mlp'){
            setTimeout(() => {
                var startTime = new Date().getTime(),
                resultMLP = AlgorithmController.MLP(dataset, network, 2000),
                endTime = new Date().getTime(),
                details = {
                    epoch: resultMLP.RMSE.length,
                    RMSE: resultMLP.RMSE[resultMLP.RMSE.length-1],
                    weights: resultMLP.weights,
                    time: `${((endTime - startTime)/1000).toFixed(2)} sec`,
                };
                if(document.querySelector('.main-display-chart')){
                    DOM.mainLoader.removeChild(DOM.mainLoader.lastElementChild);
                }
                UIController.deleteLoader();
                setDetail(details);
                generateChart(resultMLP.RMSE);
                UIController.hideDOM(DOM.btnSubmit);
                UIController.displayDOM(DOM.btnTraining);
                UIController.displayDOM(DOM.btnTest);
                if(UIController.isHidden(DOM.resultWrapper)){
                    DOM.resultWrapper.style.left = '0';
                    UIController.displayDOM(DOM.resultWrapper, 'inline-flex');
                    setTimeout(()=>{
                        DOM.resultWrapper.style.position = 'unset';
                        UIController.hideDOM(DOM.networkWrapper);
                        UIController.hideDOM(DOM.networkInfo);
                    }, 500);
                }
                AlgorithmController.setModel('network', network);
                AlgorithmController.setModel('preprocessor', preprocessor);
                AlgorithmController.setModel('RMSE', resultMLP.RMSE);
                AlgorithmController.setModel('weights', resultMLP.weights);
                AlgorithmController.setModel('test', originalDataset.test);
                AlgorithmController.setModel('time', `${((endTime - startTime)/1000).toFixed(2)} sec`);
                AlgorithmController.setModel('supplement', false);
                AlgorithmController.setModel('status', true);
                getTestResult(AlgorithmController.getModel(), originalDataset.test);
                DOM.labelSaveModel.textContent = `${modelName}.json is ready to save`;
            }, 100);
        }
        else{
            AlgorithmController.RNN(dataset, network, 2000).then(response => {
                var details = {
                    epoch: response.RMSE.length,
                    RMSE: response.RMSE[response.RMSE.length-1],
                    time: `${((response.endTime - response.startTime)/1000).toFixed(2)} sec`,
                };
                if(document.querySelector('.main-display-chart')){
                    DOM.mainLoader.removeChild(DOM.mainLoader.lastElementChild);
                }
                UIController.deleteLoader();
                setDetail(details);
                generateChart(response.RMSE);
                UIController.hideDOM(DOM.btnSubmit);
                UIController.displayDOM(DOM.btnTraining);
                UIController.displayDOM(DOM.btnTest);
                if(UIController.isHidden(DOM.resultWrapper)){
                    DOM.resultWrapper.style.left = '0';
                    UIController.displayDOM(DOM.resultWrapper, 'inline-flex');
                    setTimeout(()=>{
                        DOM.resultWrapper.style.position = 'unset';
                        UIController.hideDOM(DOM.networkWrapper);
                        UIController.hideDOM(DOM.networkInfo);
                    }, 500);
                }
                AlgorithmController.setModel('network', network);
                AlgorithmController.setModel('preprocessor', preprocessor);
                AlgorithmController.setModel('RMSE', response.RMSE);
                AlgorithmController.setModel('weights', null);
                AlgorithmController.setModel('test', originalDataset.test);
                AlgorithmController.setModel('time', details.time);
                AlgorithmController.setSupplement(response.model);
                AlgorithmController.setModel('supplement', true);
                AlgorithmController.setModel('status', true);
                getTestResult(AlgorithmController.getModel(), originalDataset.test);
                DOM.labelSaveModel.textContent = `${modelName}.json is ready to save`;
            });
        }
    });

    DOM.btnLayer.addEventListener('click', () => {
        createHiddenInput(DOM.mainLeft);
        updateHiddenStyle();
        updateHiddenNetwork();
    });

    DOM.btnTraining.addEventListener('click', () => {
        isBack = true;
        if(DOM.body.clientWidth > 480){
            DOM.detailWrapper.style.left = 'calc(100% - 300px)';
        }
        else{
            DOM.detailWrapper.style.left = '0';
            UIController.hideDOM(DOM.btnTraining);
            UIController.hideDOM(DOM.btnTest);
            UIController.displayDOM(DOM.btnBack);
        };
        if(UIController.isDisplayed(DOM.mapWrapper)){
            UIController.displayMessage('Map is opened, close it first', 'error');
        }
        else if(UIController.isDisplayed(DOM.chartWrapper)){
            UIController.displayMessage('Comparison chart is opened, close it first', 'error');
        }
        else{
            if(UIController.isDisplayed(DOM.testWrapper)){
                DOM.testWrapper.style.left = '100%';
                setTimeout(()=>{
                    if(UIController.isHidden(DOM.detailWrapper)){
                        UIController.hideDOM(DOM.testWrapper);
                        UIController.displayDOM(DOM.detailWrapper);
                    }
                }, 500);
            }
            else{
                if(UIController.isHidden(DOM.detailWrapper)){
                    UIController.displayDOM(DOM.detailWrapper);
                }
            }
        }
    });

    DOM.btnTest.addEventListener('click', () => {
        isBack = true;
        if(DOM.body.clientWidth <= 480){
            UIController.hideDOM(DOM.btnTraining);
            UIController.hideDOM(DOM.btnTest);
            UIController.displayDOM(DOM.btnBack);
        }
        if(UIController.isDisplayed(DOM.mapWrapper)){
            UIController.displayMessage('Map is opened, close it first', 'error');
        }
        else if(UIController.isDisplayed(DOM.chartWrapper)){
            UIController.displayMessage('Comparison chart is opened, close it first', 'error');
        }
        else{
            if(UIController.isDisplayed(DOM.detailWrapper)){
                DOM.detailWrapper.style.left = '100%';
                setTimeout(()=>{
                    if(UIController.isHidden(DOM.testWrapper)){
                        UIController.hideDOM(DOM.detailWrapper);
                        DOM.testWrapper.style.left = '0';
                        UIController.displayDOM(DOM.testWrapper);
                    }
                }, 500);
            }
            else{
                if(UIController.isHidden(DOM.testWrapper)){
                    DOM.testWrapper.style.left = '0';
                    UIController.displayDOM(DOM.testWrapper);
                }
            }
        }
    });
    
    DOM.btnBack.addEventListener('click', () => {
        if(UIController.isDisplayed(DOM.detailWrapper)){
            DOM.detailWrapper.style.left = '100%';
            setTimeout(()=>{
                UIController.hideDOM(DOM.detailWrapper);
            }, 500);
        }
        if(UIController.isDisplayed(DOM.testWrapper)){
            DOM.testWrapper.style.left = '100%';
            setTimeout(()=>{
                UIController.hideDOM(DOM.testWrapper);
            }, 500);
        }
        isBack = false;
        UIController.displayDOM(DOM.btnTraining);
        UIController.displayDOM(DOM.btnTest);
        UIController.hideDOM(DOM.btnBack);
    });

    DOM.btnBackDetail.addEventListener('click', () => {
        DOM.detailWrapper.style.left = '100%';
        setTimeout(()=>{
            UIController.hideDOM(DOM.detailWrapper);
        }, 500);
        isBack = false;
        UIController.displayDOM(DOM.btnTraining);
        UIController.displayDOM(DOM.btnTest);
        UIController.hideDOM(DOM.btnBack);
    });

    DOM.btnBackTest.addEventListener('click', () => {
        DOM.testWrapper.style.left = '100%';
        setTimeout(()=>{
            UIController.hideDOM(DOM.testWrapper);
        }, 500);
        isBack = false;
        UIController.displayDOM(DOM.btnTraining);
        UIController.displayDOM(DOM.btnTest);
        UIController.hideDOM(DOM.btnBack);
    });

    DOM.networks.forEach((el)=>{
        el.addEventListener('click', () => {
            DOM.networks.forEach((el)=>{
                el.classList.remove('active');
            });
            el.classList.add('active');
            if(networkName != el.dataset.network){
                if(document.querySelector('.main-display-chart')){
                    DOM.mainLoader.removeChild(DOM.mainLoader.lastElementChild);
                }

                clearInterval(intervalChart);
                UIController.DOM.chartWrapper.style.left = '100%';
                setTimeout(()=>{
                    while(UIController.DOM.chartWrapper.firstElementChild){
                        UIController.DOM.chartWrapper.removeChild(UIController.DOM.chartWrapper.firstElementChild);
                    }
                    UIController.hideDOM(UIController.DOM.chartWrapper);
                }, 500);

                if(UIController.isDisplayed(DOM.mainWrapper)){
                    DOM.mainWrapper.style.left = '100%';
                    setTimeout(()=>{
                        UIController.hideDOM(DOM.mainWrapper);
                    }, 500);
                }
                if(UIController.isDisplayed(DOM.detailWrapper)){
                    DOM.detailWrapper.style.left = '100%';
                    setTimeout(()=>{
                        UIController.hideDOM(DOM.detailWrapper);
                    }, 500);
                }
                if(UIController.isDisplayed(DOM.testWrapper)){
                    DOM.testWrapper.style.left = '100%';
                    setTimeout(()=>{
                        UIController.hideDOM(DOM.testWrapper);
                    }, 500);
                }
                networkName = el.dataset.network;
                if(DOM.body.clientWidth <= 480){
                    DOM.menus.classList.add('hide');
                }
                resetNetwork();
                isBack = false;
            }
        });
    });

    DOM.fileTraining.addEventListener('change', (element) => {
        var dataset;
        for(var i=0; i<element.target.files.length; i++){
            dataset = element.target.files[i];
        }
        if(dataset.name){
            var fr = new FileReader();
            fr.onload = function() {
                var dataset = [],
                preprocessor,
                splitData = this.result.split('\r\n');
                splitData.forEach((elem, idx) => {
                    if(idx > 0 && idx < splitData.length-1){
                        dataset.push([]);
                        elem.split(',').forEach((el, id) => {
                            if(id == 0){
                                dataset[idx-1].push(new Date(el));
                            }
                            else{
                                dataset[idx-1].push(parseFloat(el));
                            }
                        });
                    }
                });
                // dataset = AlgorithmController.shuffleData(dataset);
                preprocessor = AlgorithmController.preprocessorType(dataset, 2);
                AlgorithmController.setData({data: dataset, preprocessor: preprocessor});
                console.log(preprocessor);
                updateInputNetwork(preprocessor.input.length);
                updateOutputNetwork(preprocessor.output.length);
                createHiddenInput(DOM.mainLeft);
                updateHiddenStyle();
                updateHiddenNetwork();
                setHiddenFocus();
                DOM.dataInfo.textContent = `Data - ${dataset.length}`;
                DOM.labelSaveModel.textContent = 'No model to save';
                DOM.labelLoadModel.textContent = 'No model is selected';
                if(UIController.isHidden(DOM.mainWrapper)){
                    DOM.mainWrapper.style.left = '0';
                    UIController.displayDOM(DOM.mainWrapper, 'inline-flex');
                    setTimeout(()=>{
                        setHiddenFocus();
                    }, 500);
                }
            }
            fr.readAsText(dataset);
        }
    });

    DOM.fileModel.forEach((element) => {
        element.addEventListener('change', (elem) => {
            var model = elem.target.files[0];
            if(model.name){
                var fr = new FileReader();
                fr.onload = async function() {
                    try{
                        AlgorithmController.resetModel();
                        var result = JSON.parse(this.result),
                        details = {
                            epoch: result.RMSE.length,
                            RMSE: result.RMSE[result.RMSE.length-1],
                            weights: result.weights,
                            time: result.time,
                        };

                        var containers = window.document.querySelectorAll('.layer-container');
                        containers.forEach((el, idx) => {
                            if(idx!=0){
                                el.remove();
                            }
                        });
                        
                        result.test.input = result.test.input.map((el) => {
                            return el = el.map((e, id) => {
                                if(id == 0){
                                    return new Date(e);
                                }
                                else{
                                    return e;
                                }
                            });
                        });

                        AlgorithmController.setModel('network', result.network);
                        AlgorithmController.setModel('preprocessor', result.preprocessor);
                        AlgorithmController.setModel('RMSE', result.RMSE);
                        AlgorithmController.setModel('weights', result.weights);
                        AlgorithmController.setModel('test', result.test);
                        AlgorithmController.setModel('time', result.time);
                        AlgorithmController.setModel('supplement', result.supplement);
                        AlgorithmController.setModel('status', result.status);
                        
                        if(result.supplement){
                            var supplementModel = await tf.loadLayersModel(tf.io.browserFiles([elem.target.files[1], elem.target.files[2]]));
                            AlgorithmController.setSupplement(supplementModel);
                        }

                        if(document.querySelector('.main-display-chart')){
                            DOM.mainLoader.removeChild(DOM.mainLoader.lastElementChild);
                        }
                        getTestResult(AlgorithmController.getModel(), result.test);
                        result.network.hidden.neurons.forEach((el) => {
                            createHiddenInput(DOM.mainLeft, el);
                        });
                        setTimeout(()=>{
                            setHiddenFocus();
                        }, 500);
                        updateHiddenStyle();
                        updateHiddenNetwork();
                        updateInputNetwork(result.preprocessor.input.length);
                        updateOutputNetwork(result.preprocessor.output.length);
                        setDetail(details);
                        generateChart(result.RMSE);
                        DOM.labelLoadModel.textContent = model.name;
                        for(var i=0; i<elem.target.files.length; i++){
                            DOM.labelSaveModel.textContent = elem.target.files[i].name;
                        }
                        if(UIController.isHidden(DOM.mainWrapper)){
                            DOM.mainWrapper.style.left = '0';
                            UIController.displayDOM(DOM.mainWrapper, 'inline-flex');
                        }
                        UIController.hideDOM(DOM.btnSubmit);
                        UIController.displayDOM(DOM.btnTraining);
                        UIController.displayDOM(DOM.btnTest);
                        if(UIController.isHidden(DOM.resultWrapper)){
                            DOM.resultWrapper.style.left = '0';
                            UIController.displayDOM(DOM.resultWrapper, 'inline-flex');
                            setTimeout(()=>{
                                DOM.resultWrapper.style.position = 'unset';
                                UIController.hideDOM(DOM.networkWrapper);
                                UIController.hideDOM(DOM.networkInfo);
                            }, 500);
                        }
                    }
                    catch(err){
                        console.log(err);
                        UIController.displayMessage('The model you selected is incorrect', 'error');
                    }
                }
                fr.readAsText(model);
            }
        });
    });

    DOM.saveModel.addEventListener('click', async () => {
        var model = AlgorithmController.getModel(),
        modelName = getModelName(networkName);

        if(model.status){
            AlgorithmController.saveModel(model, `${modelName}.json`);
            if(model.supplement){
                await AlgorithmController.getSupplement().model.save(`downloads://supplement-${modelName}`);
            }
        }
        else{
            UIController.displayMessage('There is no model to save, please train your model first', 'error');
        }
    });

    DOM.btnMap.addEventListener('click', () => {
        if(UIController.isDisplayed(DOM.mapWrapper)){
            UIController.displayMessage('Comparison chart is opened, close it first', 'error');
        }
        else{
            var mapWrapper = window.document.createElement('div'),
            btnBackMap = window.document.createElement('button');    
            mapWrapper.classList.add('map-viewer');
            mapWrapper.id = 'map';
            btnBackMap.classList.add('btn-back-map');
            DOM.mapWrapper.appendChild(btnBackMap);
            DOM.mapWrapper.appendChild(mapWrapper);
            if(UIController.isHidden(DOM.mapWrapper)){
                DOM.mapWrapper.style.left = '0';
                UIController.displayDOM(DOM.mapWrapper, 'inline-flex');
            }
            btnBackMap.addEventListener('click', () => {
                DOM.mapWrapper.style.left = '100%';
                setTimeout(()=>{
                    while(DOM.mapWrapper.firstElementChild){
                        DOM.mapWrapper.removeChild(DOM.mapWrapper.firstElementChild);
                    }
                    UIController.hideDOM(DOM.mapWrapper);
                }, 500);
            });
            var mapViewer = L.map('map').setView([0.7893, 113.9213], 4);
            L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
                    attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>',
                    maxZoom: 18,
                    id: 'mapbox/streets-v11',
                    tileSize: 512,
                    zoomOffset: -1,
                    accessToken: 'pk.eyJ1IjoiZW5nZ2FyZHAiLCJhIjoiY2tkaHQ3cGQwMWoyMDJ4bnJhdG80eHFnaCJ9.DW9nOsvylx7LV2UgtN334A'
                }).addTo(mapViewer);
            mapViewer.on('dblclick', (element) => {
                L.marker(element.latlng).addTo(mapViewer);
                UIController.displayMessage(`You selected location at ${element.latlng.lat.toFixed(4)}° S and ${element.latlng.lng.toFixed(4)}° E`);
                DOM.btnMap.dataset.lat = element.latlng.lat.toFixed(4);
                DOM.btnMap.dataset.lng = element.latlng.lng.toFixed(4);
                setTimeout(() => {
                    DOM.mapWrapper.style.left = '100%';
                    setTimeout(() => {
                        while(DOM.mapWrapper.firstElementChild){
                            DOM.mapWrapper.removeChild(DOM.mapWrapper.firstElementChild);
                        }
                        UIController.hideDOM(DOM.mapWrapper);
                    }, 500);
                }, 500);
            });
        }
    });

    DOM.btnPredict.addEventListener('click', () => {
        if(DOM.btnMap.dataset.lat && DOM.btnMap.dataset.lng && DOM.inputDate.value){
            var data = {
                input: [[new Date(DOM.inputDate.value), parseFloat(DOM.btnMap.dataset.lat).toFixed(4), parseFloat(DOM.btnMap.dataset.lng).toFixed(4)]],
                output: [['', '']]
            }
            getTestResult(AlgorithmController.getModel(), data, true);
            DOM.btnMap.dataset.lat = '';
            DOM.btnMap.dataset.lng = '';
            DOM.inputDate.value = null;
        }
        else{
            if(!DOM.inputDate.value){
                UIController.displayMessage('Please enter specific date to be forecasted', 'error');
            }
            if(!DOM.btnMap.dataset.lat && !DOM.btnMap.dataset.lng){
                UIController.displayMessage('Please enter location to be forecasted', 'error');
            }
        }
    });

})(UIController, AlgorithmController);