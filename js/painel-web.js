/**
 * SGA Painel Web
 * @author rogeriolino
 */
var SGA = SGA || {};

SGA.PainelWeb = {

    layout: 'default',
    senhas: [],
    historico: [],
    ultimoId: 0,
            
    init: function() {
        SGA.PainelWeb.Config.load();
        SGA.PainelWeb.started = (SGA.PainelWeb.unidade > 0 && SGA.PainelWeb.servicos.length > 0);
        
        $.painel({
            url: SGA.PainelWeb.url,
            unidade: SGA.PainelWeb.unidade,
            servicos: SGA.PainelWeb.servicos,
            onunidades: function(unidades) {
                var list = $('#unidades');
                list.html('<option value="">Selecione</option>');
                for (var i = 0; i < unidades.length; i++) {
                    var unidade = unidades[i];
                    list.append('<option value="' + unidade.id + '">' + unidade.nome + '</option>');
                }
                if (SGA.PainelWeb.unidade > 0) {
                    list.val(SGA.PainelWeb.unidade);
                }
            },
            onservicos: function(servicos) {
                var list = $('#servicos');
                list.html('');
                for (var i = 0; i < servicos.length; i++) {
                    var servico = servicos[i];
                    var checked = SGA.PainelWeb.servicos.contains(servico.id) ? 'checked="checked"' : '';
                    list.append('<li><label><input type="checkbox" value="' + servico.id + '" ' + checked +'>' + servico.nome + '</label></li>');
                }
            },
            onsenhas: function(senhas) {
                if (SGA.PainelWeb.started && senhas && senhas.length > 0) {
                    // as senhas estao em ordem decrescente
                    var primeiro = SGA.PainelWeb.ultimoId === 0;
                    for (var i = senhas.length - 1; i >= 0; i--) {
                        var senha = senhas[i];
                        if (senha.id > SGA.PainelWeb.ultimoId) {
                            // se na primeira exibição tiver mais de um, joga no historico e chama só a última
                            if (primeiro && i > 0) {
                                // remove duplicada (em caso de rechamada)
                                SGA.PainelWeb.historico.remove(senha);
                                SGA.PainelWeb.historico.push(senha);
                            } else {
                                // remove duplicada (em caso de rechamada)
                                SGA.PainelWeb.senhas.remove(senha);
                                SGA.PainelWeb.senhas.push(senha);
                            }
                            SGA.PainelWeb.ultimoId = senha.id;
                        }
                    }
                    if (SGA.PainelWeb.Speech.queue.length === 0) {
                        SGA.PainelWeb.chamar();
                    }
                }
            }
        });
        $('#config').on('shown.bs.modal hidden.bs.modal', function(e) {
            if (e.type === 'shown') {
                // para de chamar quando abre a janela de configuracao
                SGA.PainelWeb.started = false;
            } else if (e.type === 'hidden') {
                SGA.PainelWeb.started = (SGA.PainelWeb.unidade > 0 && SGA.PainelWeb.servicos.length > 0);
            }
        });
        $('#url').on('change', function() {
            SGA.PainelWeb.url = $(this).val();
            SGA.PainelWeb.unidade = 0;
            $.painel().unidades(SGA.PainelWeb.url);
            $('#servicos, #unidades').html('');
        });
        $('#unidades').on('change', function() {
            SGA.PainelWeb.unidade = $(this).val();
            $.painel().servicos(SGA.PainelWeb.unidade);
        });
        $('#vocalizar-status').on('click', function() {
            var checked = $(this).prop('checked');
            setTimeout(function() { 
                $('.vocalizar').prop('disabled', !checked);
            }, 100);
        });
        $('#config-save').on('click', function() {
            SGA.PainelWeb.Config.save();
            $.painel({
                url: SGA.PainelWeb.url,
                servicos: SGA.PainelWeb.servicos
            });
            if (!SGA.PainelWeb.started) {
                $.painel().start();
                SGA.PainelWeb.started = true;
            }
            $('#config').modal('hide');
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
    },
            
    chamar: function() {
        var painel = SGA.PainelWeb;
        if (painel.started && painel.senhas.length > 0) {
            var senha = painel.senhas.shift();
            // atualizando a senha atual
            if (senha.peso > 0) {
                $('#layout').addClass('prioridade');
            } else {
                $('#layout').removeClass('prioridade');
            }
            var container = $('#senha-container');
            var atual = container.find('#senha span').text();
            var s = $.painel().format(senha);
            container.find('#mensagem span').text(senha.mensagem);
            container.find('#senha span').text(s);
            container.find('#local span').text(senha.local);
            container.find('#local-numero span').text(senha.numeroLocal);
            // som e animacao
            SGA.PainelWeb.Alert.play();
            SGA.PainelWeb.Speech.play(senha);
            // evita adicionar ao historico senha rechamada
            if (atual !== s) {
                // removendo duplicada
                painel.historico.remove(senha);
                // guardando historico das 10 ultimas senhas
                painel.historico.push(senha); 
                painel.historico = painel.historico.slice(Math.max(0, painel.historico.length - 10), painel.historico.length);
                // atualizando ultimas senhas chamadas
                var senhas = $('#historico .senhas');
                senhas.html('');
                // -2 porque nao exibe a ultima (senha principal). E limitando exibicao em 5
                for (var i = painel.historico.length - 2, j = 0; i >= 0 && j < 5; i--, j++) {
                    var senha = painel.historico[i];
                    var s = $.painel().format(senha);
                    var styleClass = (senha.peso > 0) ? 'prioridade' : 'normal';
                    var local = senha.local + ': ' + senha.numeroLocal;
                    senhas.append('<div class="senha-chamada ' + styleClass + '"><div class="senha"><span>' + s + '</span></div><div class="local"><span>' + local + '</span></div></div>');
                }
            }
        }
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
                if (days) {
                    var date = new Date();
                    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                    expires = "; expires=" + date.toGMTString();
                }
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

        load: function() {
            SGA.PainelWeb.url = SGA.PainelWeb.Storage.get('url');
            SGA.PainelWeb.unidade = SGA.PainelWeb.Storage.get('unidade') || 0;
            var servicos = $.trim(SGA.PainelWeb.Storage.get('servicos'));
            SGA.PainelWeb.servicos = (servicos.length > 0) ? servicos.split(',') : [];
            SGA.PainelWeb.alert = SGA.PainelWeb.Storage.get('alert') || 'ekiga-vm.wav';
            SGA.PainelWeb.vocalizar = SGA.PainelWeb.Storage.get('vocalizar') === '1';
            SGA.PainelWeb.vocalizarZero = SGA.PainelWeb.Storage.get('vocalizarZero') === '1';
            SGA.PainelWeb.vocalizarLocal = SGA.PainelWeb.Storage.get('vocalizarLocal') === '1';
            SGA.PainelWeb.lang = SGA.PainelWeb.Storage.get('lang') || 'pt';
            // atualizando interface
            $('#url').val(SGA.PainelWeb.url);
            $('#unidades').val(SGA.PainelWeb.unidade);
            $('#servicos input').each(function(i, e) {
                var value = $(e).val();
                $(e).prop('checked', SGA.PainelWeb.servicos.contains(value));
            });
            $('#alert-file').val(SGA.PainelWeb.alert);
            $('.vocalizar').prop('disabled', !SGA.PainelWeb.vocalizar);
            $('#vocalizar-status').prop('checked', SGA.PainelWeb.vocalizar);
            $('#vocalizar-zero').prop('checked', SGA.PainelWeb.vocalizarZero);
            $('#vocalizar-local').prop('checked', SGA.PainelWeb.vocalizarLocal);
            $('#idioma').val(SGA.PainelWeb.lang);
        },
                
        save: function() {
            // pegando da interface
            SGA.PainelWeb.url = $('#url').val();
            SGA.PainelWeb.servicos = [];
            $('#servicos input:checked').each(function(i,e) { 
                SGA.PainelWeb.servicos.push($(e).val()) 
            });
            SGA.PainelWeb.alert = $('#alert-file').val();
            SGA.PainelWeb.vocalizar = $('#vocalizar-status').prop('checked');
            SGA.PainelWeb.vocalizarZero = $('#vocalizar-zero').prop('checked');
            SGA.PainelWeb.vocalizarLocal = $('#vocalizar-local').prop('checked');
            SGA.PainelWeb.lang = $('#idioma').val();
            // salvando valores
            SGA.PainelWeb.Storage.set('url', SGA.PainelWeb.url);
            SGA.PainelWeb.Storage.set('unidade', SGA.PainelWeb.unidade);
            SGA.PainelWeb.Storage.set('servicos', SGA.PainelWeb.servicos.join(','));
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

$(function() {
    // carregando layout
    var layoutDir = 'layout/' + SGA.PainelWeb.layout;
    $('head').append('<link rel="stylesheet" type="text/css" href="' + layoutDir + '/style.css" />');
    $('#layout').load(layoutDir + '/index.html', function() {
        SGA.PainelWeb.init();
    });
});