/**
 * Novo SGA Painel Web
 * @author Rogerio Lino <rogeriolino@gmail.com>
 */

angular.module('app', [])
    .controller('PainelCtrl', function($scope) {
        "use strict";
        
        $scope.ultima = {
            texto: 'A000',
            local: 'Guichê',
            numeroLocal: 0,
            mensagem: 'Atendimento',
            styleClass: 'inactive'
        };
        $scope.senhas = [];
        $scope.historico = [];
        $scope.servicosUnidade = [];
        $scope.ultimoId = 0;
        $scope.lang = window.navigator.userLanguage || window.navigator.language;
        $scope.unidade = {};
                
        $scope.changeUrl = function() {
            $scope.unidades = [];
            $scope.unidade = {};
            if($scope.url.substr(-1) == '/') {$scope.url = $scope.url.substr(0, $scope.url.length - 1);}
            $.painel().unidades($scope.url);
        };
        
        $scope.changeUnidade = function(){
            if ($scope.unidade != null) {
                if ($scope.unidade.id > 0) { 
                    $.painel().servicos($scope.unidade.id);
                }
            }
        };
        $scope.changeLang = function() {
            i18n.setLng($scope.lang, function(t) {
                $("html").i18n();
            });
        };
        
        $scope.checkServico = function(servico) {
            var idx = $scope.indexServico(servico);
            if (idx > -1) {
              $scope.servicos.splice(idx, 1);
            } else {
              $scope.servicos.push(servico);
            }
        };
        
        $scope.indexServico = function(servico) {
            var idx = $scope.servicos.length - 1;
            for (; idx >= 0; idx--) {
                if ($scope.servicos[idx].id === servico.id) {
                    break;
                }
            }
            return idx;
        };
            
        $scope.save = function() {
            PainelWeb.Config.save($scope);
            $.painel({
                url: $scope.url,
                unidade: $scope.unidade.id,
                servicos: $scope.servicos.map(function(s) {
                    return s.id;
                })
            });
            if (!PainelWeb.started) {
                PainelWeb.started = true;
                $.painel().start();
            }
            $('#config').modal('hide');
            PainelWeb.trigger('save');
        };
        
        $scope.chamar = function() {
            if (PainelWeb.started && $scope.senhas.length > 0) {
                var senha = $scope.senhas.shift();

                PainelWeb.trigger('callstart');
                // som e animacao
                PainelWeb.Alert.play();
                PainelWeb.Speech.play(senha);
                PainelWeb.blink($('.blink'));
                
                // evita adicionar ao historico senha rechamada
                if ($scope.ultima.texto !== senha.texto) {
                    // removendo duplicada
                    $scope.historico.remove(senha);
                    // guardando historico das 10 ultimas senhas
                    $scope.historico.push(senha); 
                    $scope.historico = $scope.historico.slice(Math.max(0, $scope.historico.length - 10), $scope.historico.length);
                    // atualizando ultimas senhas chamadas
                    $scope.anteriores = [];
                    // -2 porque nao exibe a ultima (senha principal). E limitando exibicao em 5
                    for (var i = $scope.historico.length - 2, j = 0; i >= 0 && j < 5; i--, j++) {
                        $scope.anteriores.push($scope.historico[i]);
                    }
                }
                
                $scope.ultima = senha;
            }
        };

        $scope.init = function() {
            PainelWeb.Config.load($scope);
            PainelWeb.started = ($scope.unidade.id > 0 && $scope.servicos.length > 0);
            $.i18n.init({ 
                lng: PainelWeb.lang,
                resGetPath: 'locales/__lng__.json'
                }, function(t) { $("html").i18n();}
            );
            
            $.painel({
                url: $scope.url,
                unidade: ($scope.unidade.id > 0) ? $scope.unidade.id : 0,
                servicos: $scope.servicos.map(function(s) {
                    return s.id;
                })
            })
            .on('unidades', function(unidades) {
                $scope.$apply(function() {
                    $scope.unidades = unidades;
                });
            })
            .on('servicos', function(servicos) {
                $scope.$apply(function() {
                    $scope.servicosUnidade = servicos;
                });    
            })
            .on('senhas', function(senhas) {
                $scope.$apply(function() {
                    if (PainelWeb.started && senhas && senhas.length > 0) {
                        // as senhas estao em ordem decrescente
                        var primeiro = $scope.ultimoId === 0;
                        for (var i = senhas.length - 1; i >= 0; i--) {
                            var senha = senhas[i];
                            senha.texto = $.painel().format(senha);
                            senha.styleClass = (senha.peso > 0) ? 'prioridade' : 'normal';
                            if (senha.id > $scope.ultimoId) {
                                // se na primeira exibição tiver mais de um, joga no historico e chama só a última
                                if (primeiro && i > 0) {
                                    // remove duplicada (em caso de rechamada)
                                    $scope.historico.remove(senha);
                                    $scope.historico.push(senha);
                                } else {
                                    // remove duplicada (em caso de rechamada)
                                    $scope.senhas.remove(senha);
                                    $scope.senhas.push(senha);
                                }
                                $scope.ultimoId = senha.id;
                            }
                        }
                        if (PainelWeb.Speech.queue.length === 0) {
                            $scope.chamar();
                        }
                    }
                });
            });
            $('#config').on('shown.bs.modal hidden.bs.modal', function(e) {
                if (e.type === 'shown') {
                    // para de chamar quando abre a janela de configuracao
                    PainelWeb.started = false;
                } else if (e.type === 'hidden') {
                    PainelWeb.started = ($scope.unidade.id > 0 && $scope.servicos.length > 0);
                }
            });
            // ocultando e adicionando animacao ao menu
            setTimeout(function() {
                $('#menu').fadeTo("slow", 0, function() {
                    $('#menu').hover(
                        function() {
                            $('#menu').fadeTo("fast", 1);
                        }, 
                        function() {
                            $('#menu').fadeTo("slow", 0);
                        }
                    );
                });
            }, 3000);
            
        };
        
        $scope.themeResources = function() {
            var layoutDir = 'themes/' + $scope.theme;
            var head = document.getElementsByTagName('head')[0];
            var script = document.createElement('script');
            script.type= 'text/javascript';
            script.onload = function() {
                // loading layout manifest
                $.ajax({
                    url: layoutDir + '/manifest.json',
                    dataType: 'json',
                    cache: false,
                    success: function(manifest) {
                        if (manifest && manifest.events) {
                            var fn = window[manifest.events.onload];
                            if (fn && typeof(fn) === 'function') {
                                fn(manifest.config || {});
                            }
                        }
                    }
                });
            };
            script.src = layoutDir + '/script.js';
            head.appendChild(script);
            $("#layout").i18n();
        };
    });



var PainelWeb = {
    
    _events: {},
    
    on: function(evt, fn) {
        if (typeof(fn) === 'function') {
            PainelWeb._events[evt] = PainelWeb._events[evt] || [];
            PainelWeb._events[evt].push(fn);
        }
    },
    
    trigger: function(evt) {
        var evts = PainelWeb._events[evt] || [];
        for (var i = 0; i < evts.length; i++) {
            evts[i]();
        }
    },
    
    blink: function(elem) {
        if (!elem.css('visibility')) {
            elem.css('visibility', 'visible');
        }
        setTimeout(function() {
            var count = elem.data('bcount') || 0;
            elem.css('visibility', elem.css('visibility') === 'visible' ? 'hidden' : 'visible');
            if (count < 5) {
                elem.data('bcount', count + 1);
                PainelWeb.blink(elem);
            } else {
                elem.data('bcount', 0);
            }
        }, 200);
    },
            
    Alert: {

        test: function() {
            this.play($('#alert-file').val());
        },

        play: function(filename) {
            filename = filename || PainelWeb.alert;
            document.getElementById('alert').src = 'media/alert/' + filename;
            document.getElementById('alert').play();
        }
    },

    Speech: {
        queue: [],
        playing: false,
                
        test: function() {
            this.play(
                {
                    mensagem: i18n.t('PainelWeb.test_priority_normal') || 'Convencional',
                    sigla: 'A',
                    numero: 1,
                    length: 3,
                    local: 'test-local',
                    numeroLocal: '1',
                },
                {
                    vocalizar: $('#vocalizar-status').prop('checked'),
                    zeros: $('#vocalizar-zero').prop('checked'),
                    local: $('#vocalizar-local').prop('checked'),
                    lang: $('#idioma').val()
                }
            );
        },

        play: function(senha, params) {
            var vocalizar, zeros, local, lang;
            if (params) {
                vocalizar = params.vocalizar;
                zeros = params.zeros;
                local = params.local;
                lang = params.lang;
            } else {
                vocalizar = PainelWeb.vocalizar;
                zeros = PainelWeb.vocalizarZero;
                local = PainelWeb.vocalizarLocal;
                lang = PainelWeb.lang;
            }
            if (vocalizar) {
                // "senha"
                this.queue.push({name: "senha", lang: lang});
                // sigla + numero
                var text = (zeros) ? $.painel().format(senha) : senha.sigla + senha.numero;
                for (var i = 0; i < text.length; i++) {
                    this.queue.push({name: text.charAt(i).toLowerCase(), lang: lang});
                }
                if (local) {
                    // nome do local
                    this.queue.push({name: senha.local.toLowerCase(), lang: lang});
                    // numero do local
                    var num = senha.numeroLocal + '';
                    for (var i = 0; i < num.length; i++) {
                        this.queue.push({name: num.charAt(i).toLowerCase(), lang: lang});
                    }
                }
            }
            if (!this.playing) {
                this.processQueue();
            }
        },

        playFile: function(filename) {
            var self = this;
            var bz = new buzz.sound(filename, {
                formats: ["mp3"],
                autoplay: true
            });

            var end = function() {
                self.processQueue();
            };

            bz.bind("ended", end);
            
            bz.bind("error", end);
        },

        processQueue: function() {
            if (this.playing && this.queue.length === 0) {
                this.playing = false;
                PainelWeb.trigger('callend');
                return;
            }
            var current = this.queue.shift();
            if (current) {
                this.playing = true;
                var filename = "media/voice/" + current.lang + "/" + current.name;
                this.playFile(filename);
            }
        }
    },

    Storage: {
        
        prefix: 'painelweb_',

        set: function(name, value) {
            name = this.prefix + name;
            if (localStorage) {
                localStorage.setItem(name, value);
            } else {
                // cookie
                var expires = "";
                document.cookie = name + "=" + value + expires + "; path=/";
            }
        },
                
        get: function(name) {
            name = this.prefix + name;
            if (localStorage) {
                return localStorage.getItem(name);
            } else {
                // cookie
                var nameEQ = name + "=";
                var ca = document.cookie.split(';');
                for(var i = 0; i < ca.length; i++) {
                    var c = ca[i];
                    while (c.charAt(0) === ' ') {
                        c = c.substring(1,c.length);
                    }
                    if (c.indexOf(nameEQ) === 0) {
                        return c.substring(nameEQ.length, c.length);
                    }
                }
            }
            return null;
        }

    },
            
    Config: {

        load: function($scope) {
            $scope.theme = PainelWeb.Storage.get('theme') || 'default';
            $scope.url = PainelWeb.Storage.get('url');
            $scope.unidade = JSON.parse(PainelWeb.Storage.get('unidade')) || {};
            $scope.servicos = JSON.parse(PainelWeb.Storage.get('servicos')) || [];
            $scope.lang = PainelWeb.Storage.get('lang') || this.defaultLang();
            PainelWeb.alert = PainelWeb.Storage.get('alert') || 'ekiga-vm.wav';
            PainelWeb.vocalizar = PainelWeb.Storage.get('vocalizar') === '1';
            PainelWeb.vocalizarZero = PainelWeb.Storage.get('vocalizarZero') === '1';
            PainelWeb.vocalizarLocal = PainelWeb.Storage.get('vocalizarLocal') === '1';
            PainelWeb.lang = $scope.lang;
            // atualizando interface
            $('#alert-file').val(PainelWeb.alert);
            $('.vocalizar').prop('disabled', !PainelWeb.vocalizar);
            $('#vocalizar-status').prop('checked', PainelWeb.vocalizar);
            $('#vocalizar-zero').prop('checked', PainelWeb.vocalizarZero);
            $('#vocalizar-local').prop('checked', PainelWeb.vocalizarLocal);
        },
                
        save: function($scope) {
            // pegando da interface
            PainelWeb.alert = $('#alert-file').val();
            PainelWeb.vocalizar = $('#vocalizar-status').prop('checked');
            PainelWeb.vocalizarZero = $('#vocalizar-zero').prop('checked');
            PainelWeb.vocalizarLocal = $('#vocalizar-local').prop('checked');
            PainelWeb.lang = $('#idioma').val();
            // salvando valores
            PainelWeb.Storage.set('theme', $scope.theme);
            PainelWeb.Storage.set('url', $scope.url);
            PainelWeb.Storage.set('unidade', JSON.stringify($scope.unidade));
            PainelWeb.Storage.set('servicos', JSON.stringify($scope.servicos));
            PainelWeb.Storage.set('alert', PainelWeb.alert);
            PainelWeb.Storage.set('vocalizar', PainelWeb.vocalizar ? '1' : '0');
            PainelWeb.Storage.set('vocalizarZero', PainelWeb.vocalizarZero ? '1' : '0');
            PainelWeb.Storage.set('vocalizarLocal', PainelWeb.vocalizarLocal ? '1' : '0');
            PainelWeb.Storage.set('lang', PainelWeb.lang);
        },
        
        defaultLang: function() {
            var lang = (window.navigator.userLanguage || window.navigator.language || 'pt').split('-');
            return lang[0];
        }
        
        
    },
    
    fullscreen: function() {
        var elem = document.body;
        if (elem.requestFullScreen) {
            elem.requestFullScreen();
        }
        if (elem.webkitRequestFullScreen) {
            elem.webkitRequestFullScreen();
        }
        if (elem.mozRequestFullScreen) {
            elem.mozRequestFullScreen();
        }
        if (elem.msRequestFullScreen) {
            elem.msRequestFullScreen();
        }
    }
 
};

Array.prototype.contains = function(elem) {
    for (var i = 0; i < this.length; i++) {
        if (
            // se for senha
            (elem.sigla && this[i].sigla === elem.sigla && this[i].numero === elem.numero)
            || 
            // qualquer outro objeto
            (this[i] == elem)
            ) {
            return true;
        }
    }
    return false;
};

Array.prototype.remove = function(elem) {
    for (var i = 0; i < this.length; i++) {
        if (
            // se for senha
            (elem.sigla && this[i].sigla === elem.sigla && this[i].numero === elem.numero)
            ||
            // qualquer outro objeto
            (this[i] == elem)
            ) {
            this.splice(i, 1);
        }
    }
};


$(function() {
    $('#vocalizar-status').on('change', function() {
        var active = $(this).is(':checked');
        $('.vocalizar').prop('disabled', !active);
    });
});
