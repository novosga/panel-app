/**
 * SGA Painel Web
 * @author rogeriolino
 */
var SGA = SGA || {};

SGA.PainelWeb = {
    
    started: false,
    lang: 'pt',
    unidade: 0,
    servicos: [],
    senhas: [],
    historico: [],
    ultimoId: 0,
    
    init: function() {
        SGA.PainelWeb.unidade = SGA.PainelWeb.Storage.get('unidade') || 0;
        SGA.PainelWeb.servicos = (SGA.PainelWeb.Storage.get('servicos') || '').split(',');
        SGA.PainelWeb.started = (SGA.PainelWeb.unidade > 0 && SGA.PainelWeb.servicos.length > 0);
        
        $.painel({ 
            url: 'http://localhost/novosga-branchv1/src/public',
            unidade: SGA.PainelWeb.unidade,
            servicos: SGA.PainelWeb.servicos,
            onunidades: function(unidades) {
                var list = $('#unidades');
                list.html('');
                for (var i = 0; i < unidades.length; i++) {
                    var unidade = unidades[i];
                    list.append('<li><label><input type="radio" name="unidade" value="' + unidade.id + '">' + unidade.nome + '</label></li>');
                }
                list.find('input').on('click', function() {
                    $('#unidade-config').animate({ left: -$('#unidade-config').width() });
                    SGA.PainelWeb.unidade = $(this).val();
                    $.painel().servicos(SGA.PainelWeb.unidade);
                });
                $('#unidade-config').animate({ left: 0 });
            },
            onservicos: function(servicos) {
                var list = $('#servicos');
                list.html('');
                for (var i = 0; i < servicos.length; i++) {
                    var servico = servicos[i];
                    list.append('<li><label><input type="checkbox" value="' + servico.id + '">' + servico.nome + '</label></li>');
                }
                $('#servico-config').animate({ left: 0 });
            },
            onsenhas: function(senhas) {
                if (senhas && senhas.length > 0) {
                    // as senhas estao em ordem decrescente
                    for (var i = senhas.length - 1; i >= 0; i--) {
                        var senha = senhas[i];
                        if (senha.id > SGA.PainelWeb.ultimoId) {
                            SGA.PainelWeb.senhas.push(senha);
                            SGA.PainelWeb.ultimoId = senha.id;
                        }
                    }
                    if (SGA.PainelWeb.Speech.queue.length === 0) {
                        SGA.PainelWeb.chamar();
                    }
                }
            }
        });
        $('#servico-config .salvar').on('click', function() {
            
            SGA.PainelWeb.servicos = [];
            $('#servico-config input:checked').each(function(i,e) { 
                SGA.PainelWeb.servicos.push($(e).val()) 
            });
            
            SGA.PainelWeb.Storage.set('servicos', SGA.PainelWeb.servicos.join(','));
            SGA.PainelWeb.Storage.set('unidade', SGA.PainelWeb.unidade);
            
            $.painel().start({
                servicos: SGA.PainelWeb.servicos
            });
            $('#servico-config').animate({ left: -$('#servico-config').width() });
            SGA.PainelWeb.started = true;
        });
    },
            
    chamar: function() {
        var painel = SGA.PainelWeb;
        if (painel.started && painel.senhas.length > 0) {
            var senha = painel.senhas.shift();
            // atualizando a senha atual
            var container = $('#senha-container');
            var atual = container.find('#senha span').text();
            var s = $.painel().format(senha);
            container.find('#mensagem span').text(senha.mensagem);
            container.find('#senha span').text(s);
            container.find('#guiche span').text(senha.local);
            container.find('#guiche-numero span').text(senha.numeroLocal);
            // som e animacao
            document.getElementById('alert').play();
            SGA.PainelWeb.Speech.play(s);
            // evita adicionar ao historico senha rechamada
            if (atual !== s) {
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
                    var guiche = senha.local + ': ' + senha.numeroLocal;
                    senhas.append('<div class="senha-chamada"><div class="senha"><span>' + s + '</span></div><div class="guiche"><span>' + guiche + '</span></div></div>');
                }
            }
        }
    },

    Speech: {
        queue: [],

        play: function(text) {
            if (this.queue === undefined) {
                this.queue = [];
            }
            if (text === "senha") {
                this.queue.push({name: text, lang: SGA.PainelWeb.lang});
                this.processQueue();
                return;
            }
            for (var i = text.length - 1, chr; i >= 0; i--) {
                chr = text.charAt(i).toLowerCase();
                if (chr === '') {
                    continue;
                }
                this.queue.push({name: chr, lang: SGA.PainelWeb.lang});
            }
            this.processQueue();
        },

        playFile: function(filename) {
            var self = this;
            var bz = new buzz.sound(filename, {
                formats: ["ogg", "mp3"],
                autoplay: true
            });

            bz.bind("ended", function() {
                buzz.sounds = [];
                self.processQueue();
            });
        },

        processQueue: function() {
            if (this.queue !== undefined && this.queue.length === 0) {
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

    }
 
};

SGA.PainelWeb.init();