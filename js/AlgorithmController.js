var AlgorithmController = (() =>{
    var dataset,
    model = {
        status: false
    },
    supplement = null;

    var preprocessData = (data, preprocessor) => {
        var result = {
            input: [],
            output: []
        };
        data.input.forEach((element) => {
            var tmp = [];
            element.forEach((elem, idx) => {
                if(idx == 0){
                    // tmp.push(elem.getHours());
                    // tmp.push(elem.getDay());
                    tmp.push(elem.getDate());
                    tmp.push(elem.getMonth());
                    // tmp.push(elem.getFullYear() % 2);
                }
                else{
                    tmp.push(elem);
                }
            });
            tmp = preprocessor.input.map((elem, idx) => {
                if(elem.type == 'normalization'){
                    return (tmp[idx] - elem.min) / (elem.max - elem.min);
                }
                else{
                    return (tmp[idx] - elem.mean) / elem.std;
                }
            });
            result.input.push(tmp);
        });

        data.output.forEach((element) => {
            var tmp = preprocessor.output.map((elem, idx) => {
                if(elem.type == 'normalization'){
                    return (element[idx] - elem.min) / (elem.max - elem.min);
                }
                else{
                    return (element[idx] - elem.mean) / elem.std;
                }
            });
            result.output.push(tmp);
        });

        return result;
    };

    var preprocessorType = (data, splitter) => {
        var input = [],
        output = [];
        for(var i=0; i<5; i++){
            var splittedData = [],
            splittedDate = {
                // hour: [],
                // day: [],
                date: [],
                month: [],
                // year: []
            };
            data.forEach((element, index) => {
                if(i == 0){
                    // splittedDate.hour[index] = element[i].getHours();
                    // splittedDate.day[index] = element[i].getDay();
                    splittedDate.date[index] = element[i].getDate();
                    splittedDate.month[index] = element[i].getMonth();
                    // splittedDate.year[index] = element[i].getFullYear() % 2;
                }
                else{
                    splittedData[index] = element[i];
                }
            });
            if(i <= splitter){
                if(i == 0){
                    // input.push(standardizeData(splittedDate.hour));
                    // input.push(standardizeData(splittedDate.day));
                    input.push(standardizeData(splittedDate.date));
                    input.push(standardizeData(splittedDate.month));
                    // input.push(standardizeData(splittedDate.year));
                }
                else{
                    input.push(standardizeData(splittedData));
                }
            }
            else{
                if(i == 0){
                    // output.push(normalizeData(splittedDate.hour));
                    // output.push(normalizeData(splittedDate.day));
                    output.push(normalizeData(splittedDate.date));
                    output.push(normalizeData(splittedDate.month));
                    // output.push(normalizeData(splittedDate.year));
                }
                else{
                    output.push(normalizeData(splittedData));
                }
            }
        }

        return {
            input: input,
            output: output
        }
    };

    var normalizeData = (data) => {
        var minData, maxData;
        minData = Math.min(...data);
        maxData = Math.max(...data);

        // var result = data.map((el) => {
        //     return (el - minData) / (maxData - minData);
        // });

        return {
            type: 'normalization',
            min: minData,
            max: maxData
        };
    };

    var denormalizeData = (value, parameters) => {
        return (value * (parameters.max - parameters.min)) + parameters.min;
    };

    var standardizeData = (data) => {
        var mean = 0, std = 0;
        data.forEach((el) => {
            mean += el;
        });
        mean /= data.length;
        data.forEach((el) => {
            std += (Math.pow(el - mean, 2));
        });
        std = std / data.length;
        std = Math.sqrt(std);

        // var result = data.map((el) => {
        //     return (el - mean) / std;
        // });

        return {
            type: 'standardization',
            mean: mean,
            std: std
        }
    };

    var destandardizeData = (value, parameters) => {
        return (value * parameters.std) + parameters.mean;
    };

    var calculateError = (output, target, type = 'loss') => {
        var result = 0;
        if(type == 'rmse'){    
            target.forEach((el, idx) => {
                result = result + Math.pow((el-output[idx]),2);
            });

            return Math.sqrt(result / target.length);
        }
        else if(type == 'mse'){    
            target.forEach((el, idx) => {
                result = result + Math.pow((el-output[idx]),2);
            });

            return result / target.length;
        }
        else if(type == 'mae'){    
            target.forEach((el, idx) => {
                result = result + Math.abs(el-output[idx]);
            });

            return result / target.length;
        }
        else if(type == 'mape'){    
            target.forEach((el, idx) => {
                result = result + Math.abs((el-output[idx])/el);
            });

            return (result * 100) / target.length;
        }
        else if(type == 'r2'){ 
            // var mean = target.reduce((total, el) => {
            //     return total + (el / target.length);
            // }, 0),
            // ssr = 0,
            // sst = 0;
            // target.forEach((el, idx) => {
            //     ssr = ssr + Math.pow((el - parseFloat(output[idx])), 2);
            //     sst = sst + (Math.pow((el - mean), 2));
            // });
            // return (1 - (ssr/sst)) * 100;
            var x=0,
            y=0,
            x2=0,
            y2=0,
            xy = 0;
            target.forEach((el, idx) => {
                x = x + el;
                y = y + parseFloat(output[idx]);
                x2 = x2 + Math.pow(el, 2);
                y2 = y2 + Math.pow(parseFloat(output[idx]), 2);
                xy = xy + (el*parseFloat(output[idx]));
            });
            return Math.pow((((target.length*xy) - (x*y)) / Math.sqrt(((target.length*x2) - Math.pow(x, 2)) * ((target.length*y2) - Math.pow(y, 2)))), 2) * 100;
        }
        else{
            target.forEach((el, idx) => {
                result = result + (Math.pow((el-output[idx]),2) / 2);
            });

            return result;
        }
    }

    var activation = (x, activationType ='sigmoid') => {
        var fx, dFx, errorMessage = 'The value entered in activation function is incorrect';
        try{
            if(activationType.toLowerCase() == 'identity'){
                fx = x;
                dFx = 1;
            }
            else if(activationType.toLowerCase() == 'binary'){
                if(x < 0){
                    fx = 0;
                }
                else{
                    fx = 1;
                }
                dFx = 0;
            }
            else if(activationType.toLowerCase() == 'sigmoid' || activationType.toLowerCase() == 'logistic'){
                fx = 1/(1+Math.exp(-1*x));
                dFx = fx*(1-fx);
            }
            else if(activationType.toLowerCase() == 'tanh'){
                fx = (2/(1+Math.exp(-2*x)))-1;
                dFx = 1-Math.pow(fx,2);
            }
            else if(activationType.toLowerCase() == 'atan'){
                fx = Math.atan(x);
                dFx = 1/(Math.pow(x,2)+1);
            }
            else if(activationType.toLowerCase() == 'relu'){
                if(x <= 0){
                    fx = 0;
                    dFx = 0;
                }
                else{
                    fx = x;
                    dFx = 1;
                }
            }
            else if(activationType.toLowerCase() == 'softmax'){
                var totalFx = x.reduce((total, el) => {
                    return total + Math.exp(el);
                }, 0);
                fx = x.map((el)=>{
                    return Math.exp(el)/totalFx;
                });
                dFx = fx.map((el) => {
                    return el*(1-el);
                });
            }
            else{
                errorMessage = 'The activation type entered is incorrect';
            }

            return {
                fx: fx,
                dFx: dFx,
                status: true
            }
        }
        catch{
            return {
                message: errorMessage,
                status: false
            };
        }
    };

    var isInArray = (el, array) => {
        var status = false;
        for(var i=0; i<array.length; i++){
            if(el == array[i]){
                status = true;
                break;
            }
        }

        return status;
    };

    var shuffleData = (data) => {
        var posShuffle = [];
        while(posShuffle.length != data.length){
            var randomEl = Math.floor(Math.random()*data.length);
            if(!isInArray(randomEl, posShuffle)){
                posShuffle.push(randomEl);
            }
        };
        var shuffledData = posShuffle.map((el)=>{
            return data[el];
        });

        return shuffledData;
    };

    var separateData = (data, percentage, index) => {
        var obj = new Object();
        var totalPercentage = 0;
        percentage.forEach((element) => {
            obj[element.name] = new Object();
            obj[element.name].input = [];
            obj[element.name].output = [];
            data.slice(totalPercentage, totalPercentage + Math.round((element.val/100) * data.length)).forEach((elem) => {
                obj[element.name].input.push(elem.slice(0, index));
                obj[element.name].output.push(elem.slice(index));
            });
            totalPercentage += Math.round((element.val/100) * data.length);
        });

        return obj;
    };

    var generateWeights = (prev, current, lowerBound, upperBound) => {
        var result = [];
        for(var i=0; i<current; i++){
            var singleNeuron = [];
            for(var j=0; j<=prev; j++){
                singleNeuron.push(lowerBound + (upperBound-lowerBound) * Math.random());
            }
            result.push(singleNeuron);
        }

        return result;
    };

    var initWeights = (network, lowerBound, upperBound) => {
        var hidden = [];
        for(var i=0; i<network.hidden.neurons.length; i++){
            if(i==0){
                hidden.push(generateWeights(network.input.neurons, network.hidden.neurons[i], lowerBound, upperBound));
            }
            else{
                hidden.push(generateWeights(network.hidden.neurons[i-1], network.hidden.neurons[i], lowerBound, upperBound));
            }
        }
        var output = generateWeights(network.hidden.neurons[network.hidden.neurons.length-1], network.output.neurons, lowerBound, upperBound);

        return [...hidden, output];
    };

    var sum = (input, weights) => {
        var total = 0;
        for(var i=0; i<input.length; i++){
            total = total + (input[i]*weights[i]);
        }
        total = total + weights[weights.length-1];
        return total;
    };

    var forward = (input, weights, network) => {
        var result = [];
        var error = null;
        for(var i=0; i<weights.length; i++){
            var resultLayer = [];
            if(i==0){
                for(var j=0; j<weights[i].length; j++){
                    var activated = activation(sum(input, weights[i][j]), network.hidden.activations[i]);
                    if(activated.status){
                        resultLayer.push(activated);
                    }
                    else{
                        error = activated.message;
                    }
                }
                result.push(resultLayer);
            }
            else{
                var resultLayer = [];
                var inputObtained = result[i-1].map((el) => {
                    return el.fx;
                })
                if(i==weights.length-1){
                    for(var j=0; j<weights[i].length; j++){
                        var activated = activation(sum(inputObtained, weights[i][j]), network.output.activations);
                        if(activated.status){
                            resultLayer.push(activated);
                        }
                        else{
                            error = activated.message;
                        }
                    }
                }
                else{
                    for(var j=0; j<weights[i].length; j++){
                        var activated = activation(sum(inputObtained, weights[i][j]), network.hidden.activations[i]);
                        if(activated.status){
                            resultLayer.push(activated);
                        }
                        else{
                            error = activated.message;
                        }
                    }
                }
                result.push(resultLayer);
            }
        }

        return {
            result: result,
            error: error
        };
    };

    var backward = (data, weights) => {
        var smallDelta = [], bigDelta = [];
        for(var i=weights.length-1; i>=0; i--){
            smallDelta.push([]);
        }
        for(var i=weights.length-1; i>=0; i--){
            data.result.forEach((elem, index) => {
                if(index == 0){
                    elem[i].forEach(() => {
                        smallDelta[i].push(0);
                    });
                }
                if(i == weights.length-1){
                    elem[i].forEach((el, idx) => {
                        smallDelta[i][idx] = smallDelta[i][idx] + ( -1 * (data.output[index][idx] - el.fx) * el.dFx);
                    });
                }
                else{
                    elem[i].forEach((el, idx) => {
                        smallDelta[i][idx] = smallDelta[i][idx] + smallDelta[i+1].reduce((total, e, id) => {
                            return total + (e * weights[i+1][id][idx]);
                        }, 0);
                        smallDelta[i][idx] = smallDelta[i][idx] * el.dFx;
                    });
                }
            });
            if(i == weights.length-1){
                smallDelta[i] = smallDelta[i].map((el) => {
                    return el / data.result.length;
                });
            }
        }

        weights.forEach((element, index) => {
            bigDelta.push([]);
            if(index == 0){
                element.forEach((elem, idx) => {
                    bigDelta[index].push([]);
                    elem.forEach((el, id) => {
                        if(id == elem.length-1){
                            bigDelta[index][idx].push(smallDelta[index][idx]);
                        }
                        else{
                            bigDelta[index][idx].push(0);
                            for(var i=0; i<data.input.length; i++){
                                bigDelta[index][idx][id] = bigDelta[index][idx][id] + (smallDelta[index][idx] * data.input[i][id]);
                            };
                            bigDelta[index][idx][id] = bigDelta[index][idx][id] / data.input.length;
                        }
                    });
                });
            }
            else{
                element.forEach((elem, idx) => {
                    bigDelta[index].push([]);
                    elem.forEach((el, id) => {
                        if(id == elem.length-1){
                            bigDelta[index][idx].push(smallDelta[index][idx]);
                        }
                        else{
                            bigDelta[index][idx].push(0);
                            for(var i=0; i<data.result.length; i++){
                                bigDelta[index][idx][id] = bigDelta[index][idx][id] + (smallDelta[index][idx] * data.result[i][index-1][id].fx);
                            };
                            bigDelta[index][idx][id] = bigDelta[index][idx][id] / data.result.length;
                        }
                    });
                });
            }
        });

        return bigDelta;
    };

    var updateWeights = (oldWeight, delta, learningRate) => {
        var newWeights = [];
        oldWeight.forEach((element, index) => {
            newWeights.push([]);
            element.forEach((elem, idx) => {
                newWeights[index].push([]);
                elem.forEach((el, id) => {
                    newWeights[index][idx].push(el - (learningRate * delta[index][idx][id]));
                });
            });
        });

        return newWeights;
    };

    var dataSplitter = (data) => {
        var validation = {
            input: [],
            output: []
        },
        training = {
            input: [],
            output: []
        },
        splitterSet = data.training.input.length - Math.round((data.validation/100) * data.training.input.length);
        training.input = data.training.input.slice(0, splitterSet);
        training.output = data.training.output.slice(0, splitterSet);
        validation.input = data.training.input.slice(splitterSet);
        validation.output = data.training.output.slice(splitterSet);
        return {
            training,
            validation
        };
    }

    var MLP = (data, network, epoch) => {
        var weights = initWeights(network, -1, 1);
        var learningRate = 0.5,
        totalRMSETraining = [],
        totalRMSEValidation = [],
        totalWeights = [],
        dataset = dataSplitter(data);

        console.log('validation', dataset.validation);
        console.log('training', dataset.training);

        for(var i=0; i<epoch; i++){
            var errorTraining = [],
            errorValidation = [],
            results = {
                result: [],
                input: [],
                output: []
            };

            dataset.training.input.forEach((el, idx) => {
                var forwardTraining = forward(el, weights, network).result;
                var outputTraining = [];
                forwardTraining[forwardTraining.length-1].forEach((el) => {
                    outputTraining.push(el.fx);
                });
                errorTraining.push(calculateError(outputTraining, dataset.training.output[idx], 'rmse'));
                results.input.push(el);
                results.output.push(dataset.training.output[idx]);
                results.result.push(forwardTraining);

                if(idx+1==dataset.training.input.length){
                    var resultBackward = backward(results, weights);
                    weights = updateWeights(weights, resultBackward, learningRate);
                }
                else{
                    if(((idx+1) % network.batch) == 0){
                        var resultBackward = backward(results, weights);
                        weights = updateWeights(weights, resultBackward, learningRate);
                        results = {
                            result: [],
                            input: [],
                            output: []
                        }
                    }
                }
            });

            dataset.validation.input.forEach((el, idx) => {
                var forwardValidation = forward(el, weights, network).result;
                var outputValidation = [];
                forwardValidation[forwardValidation.length-1].forEach((el) => {
                    outputValidation.push(el.fx);
                });
                errorValidation.push(calculateError(outputValidation, dataset.validation.output[idx], 'rmse'));
            });

            var RMSETraining = errorTraining.reduce((total, el) => {
                return total + (el / errorTraining.length);
            }, 0);
            totalRMSETraining.push(RMSETraining);

            var RMSEValidation = errorValidation.reduce((total, el) => {
                return total + (el / errorValidation.length);
            }, 0);
            totalRMSEValidation.push(RMSEValidation);

            totalWeights.push(weights);
        }

        // return {
        //     weights: totalWeights[totalWeights.length-1],
        //     RMSE: totalRMSETraining
        // }
        return optimumTraining({weights: totalWeights, RMSE: {training: totalRMSETraining, validation: totalRMSEValidation}});
    };

    var RNN = async (data, network, epoch) => {
        var training = {
            input: tf.tensor2d(data.training.input),
            output: tf.tensor2d(data.training.output)
        },
        lstmCells = [];
        
        console.log('training', data.training);

        network.hidden.neurons.forEach((el,idx)=>lstmCells.push(tf.layers.lstmCell({units: el, activation: network.hidden.activations[idx]})));
        var model = tf.sequential();
        model.add(tf.layers.dense({
            units: 8,
            inputShape: [network.input.neurons]
        }));
        model.add(tf.layers.reshape({targetShape: [8,1]}));
        model.add(tf.layers.rnn({
            cell: lstmCells
        }));
        model.add(tf.layers.dense({units: network.output.neurons}));
        model.compile({
            optimizer: tf.train.sgd(),
            loss: tf.losses.meanSquaredError
        });
        return trainLSTM(training, null, network, model, epoch).then((response) => response);
    }

    var trainLSTM = async (training, validation, network, model, epoch) => {
        var startTime = new Date().getTime(),
        RMSE = [];
        for(var i=0; i<epoch; i++){
            var history = await model.fit(training.input, training.output,{
                batch: network.batch
            });
            RMSE.push(Math.sqrt(history.history.loss[0]));
            // console.log(i, Math.sqrt(history.history.loss[0]));
        }
        var endTime = new Date().getTime();
        return {
            startTime,
            endTime,
            RMSE,
            model
        }
    }

    var optimumTraining = (data) => {
        var minIndex = data.RMSE.validation.indexOf(Math.min(...data.RMSE.validation));
        var totalErrors = data.RMSE.training.slice(0, minIndex+1);

        return{
            weights: data.weights[minIndex],
            RMSE: totalErrors
        }
    };

    var testNetwork = (data, weights, network) => {
        var result = [];
        data.forEach((el) => {
            var forwardTest = forward(el, weights, network).result,
            outputTest = [];
            forwardTest[forwardTest.length-1].forEach((el) => {
                outputTest.push(el.fx);
            });
            result.push(outputTest);
        });
        return result;
    };

    var saveModel = (jsondata, name) => {
        var encode = (singlejson) => {
            var out = [];
            for (var i=0; i<singlejson.length; i++) {
                out[i] = singlejson.charCodeAt(i);
            }
            return new Uint8Array(out);
        }
        var data = encode(JSON.stringify(jsondata, null, 4));
    
        var blob = new Blob([data], {
            type: 'application/octet-stream'
        });
        
        url = URL.createObjectURL(blob);
        var link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', name);
        
        var event = document.createEvent('MouseEvents');
        event.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
        link.dispatchEvent(event);
    };

    return {
        MLP: (data, network, epoch) => {
            return MLP(data, network, epoch);
        },

        RNN: async (data, network, epoch) => {
            return RNN(data, network, epoch);
        },

        shuffleData: (data) => {
            return shuffleData(data);
        },

        separateData: (data, percentage, index) => {
            return separateData(data, percentage, index);
        },

        preprocessorType: (data, splitter) => {
            return preprocessorType(data, splitter);
        },

        preprocessData: (data, preprocessor) => {
            return preprocessData(data, preprocessor);
        },
        
        normalizeData: (data) => {
            return normalizeData(data);
        },

        denormalizeData: (value, parameters) => {
            return denormalizeData(value, parameters);
        },

        standardizeData: (data) => {
            return standardizeData(data);
        },

        destandardizeData: (value, parameters) => {
            return destandardizeData(value, parameters);
        },

        calculateError: (output, target, type = "loss") => {
            return calculateError(output, target, type);
        },

        setData: (data) => {
            dataset = data;
        },

        setModel: (name, value) => {
            model[name] = value;
        },

        getModel: () => {
            return model
        },

        setSupplement: (model) => {
            supplement = model;
        },

        getSupplement: () => {
            return supplement;
        },
        
        resetModel: () => {
            model = {
                status: false
            };
        },

        getData: () => {
            return dataset;
        },
        
        testNetwork: (data, weights, network) => {
            return testNetwork(data, weights, network);
        },

        saveModel: (jsondata, name) => {
            saveModel(jsondata, name);
        }
    }
})();