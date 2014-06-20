/**
 * Novo SGA Painel Web
 * @author Rogerio Lino <rogeriolino@gmail.com>
 */

angular.module('app', [])
    .controller('PainelCtrl', function($scope) {
        "use strict";
        
        $scope.layout = 'default';

        $scope.ultima = {
            texto: 'A000',
            local: 'Guichê',
            numeroLocal: 0,
            mensagem: 'Atendimento',
            styleClass: ''
        };
        $scope.senhas = [];
        $scope.historico = [];
        $scope.servicosUnidade = [];
        $scope.ultimoId = 0;
        
        $scope.changeUnidade = function(){
            $.painel().servicos($scope.unidade.id);
        };
                
        $scope.changeUrl = function() {
            $scope.unidade = 0;
            $.painel().unidades($scope.url);
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
            SGA.PainelWeb.Config.save($scope);
            $.painel({
                url: $scope.url,
                servicos: $scope.servicos.map(function(s) {
                    return s.id;
                })
            });
            if (!SGA.PainelWeb.started) {
                SGA.PainelWeb.started = true;
                $.painel().start();
            }
            $('#config').modal('hide');
        };
        
        $scope.chamar = function() {
            if (SGA.PainelWeb.started && $scope.senhas.length > 0) {
                var senha = $scope.senhas.shift();

                // som e animacao
                SGA.PainelWeb.Alert.play();
                SGA.PainelWeb.Speech.play(senha);
                SGA.PainelWeb.blink($('.blink'));
                
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
            SGA.PainelWeb.Config.load($scope);
            SGA.PainelWeb.started = ($scope.unidade.id > 0 && $scope.servicos.length > 0);

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
                    if (SGA.PainelWeb.started && senhas && senhas.length > 0) {
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
                        if (SGA.PainelWeb.Speech.queue.length === 0) {
                            $scope.chamar();
                        }
                    }
                });
            });
            $('#config').on('shown.bs.modal hidden.bs.modal', function(e) {
                if (e.type === 'shown') {
                    // para de chamar quando abre a janela de configuracao
                    SGA.PainelWeb.started = false;
                } else if (e.type === 'hidden') {
                    SGA.PainelWeb.started = ($scope.unidade.id > 0 && $scope.servicos.length > 0);
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
        
        $scope.layoutResources = function() {
            var layoutDir = 'layout/' + $scope.layout;
            var head = document.getElementsByTagName('head')[0];
            var script = document.createElement('script');
            script.type= 'text/javascript';
            script.onload = function() {
                // loading layout manifest
                $.ajax({
                    url: layoutDir + '/manifest.json',
                    dataType: 'json',
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
        };
    });




var SGA = SGA || {};

SGA.PainelWeb = {
    
    blink: function(elem) {
        if (!elem.css('visibility')) {
            elem.css('visibility', 'visible');
        }
        setTimeout(function() {
            var count = elem.data('bcount') || 0;
            elem.css('visibility', elem.css('visibility') === 'visible' ? 'hidden' : 'visible');
            if (count < 5) {
                elem.data('bcount', count + 1);
                SGA.PainelWeb.blink(elem);
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
            filename = filename || SGA.PainelWeb.alert;
            document.getElementById('alert').src = 'media/alert/' + filename;
            document.getElementById('alert').play();
        }
    },

    Speech: {
        queue: [],
                
        test: function() {
            this.play(
                {
                    mensagem: 'Convencional',
                    sigla: 'A',
                    numero: 1,
                    length: 3,
                    local: 'Guichê',
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
                vocalizar = SGA.PainelWeb.vocalizar;
                zeros = SGA.PainelWeb.vocalizarZero;
                local = SGA.PainelWeb.vocalizarLocal;
                lang = SGA.PainelWeb.lang;
            }
            if (vocalizar) {
                if (local) {
                    // numero do local
                    var num = senha.numeroLocal + '';
                    for (var i = num.length - 1; i >= 0; i--) {
                        this.queue.push({name: num.charAt(i).toLowerCase(), lang: lang});
                    }
                    // "local"
                    this.queue.push({name: "local", lang: lang});
                }
                // sigla + numero
                var text = (zeros) ? $.painel().format(senha) : senha.sigla + senha.numero;
                for (var i = text.length - 1; i >= 0; i--) {
                    this.queue.push({name: text.charAt(i).toLowerCase(), lang: lang});
                }
                // "senha"
                this.queue.push({name: "senha", lang: lang});
            }
            this.processQueue();
        },

        playFile: function(filename) {
            var self = this;
            var bz = new buzz.sound(filename, {
                formats: ["mp3"],
                autoplay: true
            });

            bz.bind("ended", function() {
                buzz.sounds = [];
                self.processQueue();
            });
        },

        processQueue: function() {
            if (this.queue.length === 0) {
                return;
            }
            if (buzz.sounds.length > 0) {
                return;
            }
            var current = this.queue.pop();
            var filename = "media/voice/" + current.lang + "/" + current.name;
            this.playFile(filename);
        }
    },

    Storage: {

        set: function(name, value) {
            if (localStorage) {
                localStorage.setItem(name, value);
            } else {
                // cookie
                var expires = "";
                document.cookie = name + "=" + value + expires + "; path=/";
            }
        },
                
        get: function(name) {
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
            $scope.url = SGA.PainelWeb.Storage.get('url');
            $scope.unidade = JSON.parse(SGA.PainelWeb.Storage.get('unidade')) || {};
            $scope.servicos = JSON.parse(SGA.PainelWeb.Storage.get('servicos')) || [];
            SGA.PainelWeb.alert = SGA.PainelWeb.Storage.get('alert') || 'ekiga-vm.wav';
            SGA.PainelWeb.vocalizar = SGA.PainelWeb.Storage.get('vocalizar') === '1';
            SGA.PainelWeb.vocalizarZero = SGA.PainelWeb.Storage.get('vocalizarZero') === '1';
            SGA.PainelWeb.vocalizarLocal = SGA.PainelWeb.Storage.get('vocalizarLocal') === '1';
            SGA.PainelWeb.lang = SGA.PainelWeb.Storage.get('lang') || 'pt';
            
            // atualizando interface
            $('#alert-file').val(SGA.PainelWeb.alert);
            $('.vocalizar').prop('disabled', !SGA.PainelWeb.vocalizar);
            $('#vocalizar-status').prop('checked', SGA.PainelWeb.vocalizar);
            $('#vocalizar-zero').prop('checked', SGA.PainelWeb.vocalizarZero);
            $('#vocalizar-local').prop('checked', SGA.PainelWeb.vocalizarLocal);
            $('#idioma').val(SGA.PainelWeb.lang);
        },
                
        save: function($scope) {
            // pegando da interface
            SGA.PainelWeb.alert = $('#alert-file').val();
            SGA.PainelWeb.vocalizar = $('#vocalizar-status').prop('checked');
            SGA.PainelWeb.vocalizarZero = $('#vocalizar-zero').prop('checked');
            SGA.PainelWeb.vocalizarLocal = $('#vocalizar-local').prop('checked');
            SGA.PainelWeb.lang = $('#idioma').val();
            // salvando valores
            SGA.PainelWeb.Storage.set('url', $scope.url);
            SGA.PainelWeb.Storage.set('unidade', JSON.stringify($scope.unidade));
            SGA.PainelWeb.Storage.set('servicos', JSON.stringify($scope.servicos));
            SGA.PainelWeb.Storage.set('alert', SGA.PainelWeb.alert);
            SGA.PainelWeb.Storage.set('vocalizar', SGA.PainelWeb.vocalizar ? '1' : '0');
            SGA.PainelWeb.Storage.set('vocalizarZero', SGA.PainelWeb.vocalizarZero ? '1' : '0');
            SGA.PainelWeb.Storage.set('vocalizarLocal', SGA.PainelWeb.vocalizarLocal ? '1' : '0');
            SGA.PainelWeb.Storage.set('lang', SGA.PainelWeb.lang);
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
    },
 
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
