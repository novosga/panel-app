/**
 * Painel.js
 * @author Rogerio Lino <rogeriolino@gmail.com>
 */
;(function($) {
    "use strict";
    var setup = false;
    var defaults = {
        url: "",
        unidade: 0,
        servicos: [],
        interval: 3,
        events: {}
    };
    $.painel = function(opts) {
        var self = this;
        if (setup) {
            // updating options
            self.options = $.extend(self.options, opts);
            return self;
        }
        setup = true;

        self.options = $.extend(defaults, opts);
        self.intervalId = 0;
        self.started = false;

        self.unidades = function(url) {
            self.options.url = url;
            loadUnidades(self);
        };

        self.servicos = function(unidade) {
            self.options.unidade = unidade;
            loadServicos(self);
        };

        self.start = function() {
            if (!self.started) {
                self.started = true;
                setInterval(function() {
                    if (self.started) {
                        loadSenhas(self);
                    }
                }, self.options.interval * 1000);
                loadSenhas(this);
            }
        };

        self.pause = function() {
            self.started = false;
        };

        self.format = function(senha) {
            var numero = senha.numero + "";
            var length = parseInt(senha.length || 3);
            while (numero.length < length) {
                numero = "0" + numero;
            }
            return senha.sigla + numero;
        };

        // init
        if (self.options.url) {
            loadUnidades(this);
            if (self.options.unidade > 0) {
                loadServicos(self);
                if (self.options.servicos.length > 0) {
                    self.start();
                }
            }
        }
        
        self.on = function(eventName, fn) {
            if (typeof(fn) === 'function') {
                self.options.events[eventName] = fn;
            }
            return self;
        };
        
        self.trigger = function(eventName, params) {
            var fn = self.options.events[eventName];
            if (typeof(fn) === 'function') {
                fn.apply(self, params);
            }
        };

        return self;
    };
    
    /**
     * Carrega as unidades disponiveis
     * 
     * @param object painel
     */
    var loadUnidades = function(painel) {
        var url = painel.options.url;
        apiRequest(url + '/api/unidades', {
            complete: function(unidades) {
                painel.trigger('unidades', [unidades]);
            }
        });
    };
    
    /**
     * Carrega os servicos disponiveis para a unidade
     * 
     * @param object painel
     */
    var loadServicos = function(painel) {
        var url = painel.options.url;
        var unidade = painel.options.unidade;
        apiRequest(url + '/api/servicos/' + unidade, {
            complete: function(servicos) {
                painel.trigger('servicos', [servicos]);
            }
        });
    };
    
    /**
     * 
     * @param object painel
     */
    var loadSenhas = function(painel) {
        var url = painel.options.url;
        var unidade = painel.options.unidade;
        var servicos = painel.options.servicos;
        apiRequest(url + '/api/painel/' + unidade, {
            data: { servicos: servicos.join(',') },
            complete: function(senhas) {
                painel.trigger('senhas', [senhas]);
            }
        });
    };
    
    var apiRequest = function(url, args) {
        $.ajax({
            url: url,
            dataType: 'json',
            data: args.data || {},
            success: function(response) {
                if (typeof(args.complete) === 'function') {
                    args.complete(response);
                }
            },
            error: function() {
            }
        });
    };
    
})(jQuery);
