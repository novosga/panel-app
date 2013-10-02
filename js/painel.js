/**
 * Painel.js
 * @author rogeriolino
 */
;(function($) {
    "use strict"
    var setup = false;
    var defaults = {
        url: "",
        unidade: 0,
        servicos: [],
        interval: 3
    };
    $.painel = function(opts) {
        if (!setup) {
            setup = true;
            this.options = $.extend(defaults, opts);
            this.intervalId = 0;
            this.started = false;
            
            this.servicos = function(unidade) {
                this.options.unidade = unidade;
                loadServicos(this.options.url, unidade, this.options.onservicos);
            };
            
            this.start = function(opts) {
                if (!this.started) {
                    var self = this;
                    this.started = true;
                    this.options = $.extend(this.options, opts);
                    setInterval(function() {
                        if (self.started) {
                            loadSenhas(
                                self.options.url, 
                                self.options.unidade, 
                                self.options.servicos, 
                                self.options.onsenhas
                            );
                        }
                    }, self.options.interval * 1000);
                    loadSenhas(
                        self.options.url, 
                        self.options.unidade, 
                        self.options.servicos, 
                        self.options.onsenhas
                    );
                }
            };
            
            this.pause = function() {
                this.started = false;
            };
            
            this.format = function(senha) {
                var numero = senha.numero + "";
                var length = parseInt(senha.length || 3);
                while (numero.length < length) {
                    numero = "0" + numero;
                }
                return senha.sigla + numero;
            };
            
            // init
            if (!this.options.unidade) {
                loadUnidades(this.options.url, this.options.onunidades);
            } else {
                if (this.options.servicos.length > 0) {
                    this.start();
                }
            }
        }
        return this;
    };
    /**
     * Carrega as unidades disponiveis
     * @param string url
     * @param function complete
     * @returns undefined
     */
    var loadUnidades = function(url, complete) {
        $.ajax({
            url: url + '/api/unidades',
            success: function(unidades) {
                if (typeof(complete) === 'function') {
                    complete(unidades);
                }
            }
        });
    };
    /**
     * Carrega os servicos disponiveis para a unidade
     * @param string url
     * @param integer unidade
     * @param function complete
     * @returns undefined
     */
    var loadServicos = function(url, unidade, complete) {
        $.ajax({
            url: url + '/api/servicos/' + unidade,
            success: function(servicos) {
                if (typeof(complete) === 'function') {
                    complete(servicos);
                }
            }
        });
    };
    /**
     * 
     * @param {type} url
     * @param {type} unidade
     * @param {type} servicos
     * @returns {undefined}
     */
    var loadSenhas = function(url, unidade, servicos, complete) {
        $.ajax({
            url: encodeURI(url + '/api/painel/' + unidade),
            data: { servicos: servicos.join(',') },
            success: function(senhas) {
                if (typeof(complete) === 'function') {
                    complete(senhas);
                }
            }
        });
    };
    
})($);
