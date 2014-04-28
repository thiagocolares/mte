$(document).ready(function() {

    //Grid do Anexo 1 e 2
    $('#gridContainerAnexo1').loadGrid('questionario-grte/grid-anexo-um-grte', $('#idQuestionarioGrte'), 1);
    $('#gridContainerAnexo2').loadGrid('questionario-grte/grid-anexo-dois-grte', $('#idQuestionarioGrte'), 1);

    //Máscaras

    //Máscaras do Bloco 1
    $("#2-data_levantamento").mask("99/99/9999");
    $("#4-codigo_grte").mask("9999999-9");
    $("#7-telefone_grte").mask("(99) 999999?999");
    $("#13-tempo_cargo-ano").mask("9?9");
    $("#13-tempo_cargo-meses").mask("9?9");

    //Máscaras do Bloco 3
    $("#q18-0").mask("9?99");
    $("#q18-1").mask("9?99");
    $("#q18-2").mask("9?99");
    $("#q18-3").mask("9?99");
    $("#q18-4").mask("9?99");
    $("#q18-5").mask("9?99");

    //Anexo 1
    $("#anx1-6").mask("9?99");
    $("#anx1-10").mask("9?99");
    $("#anx1-11").mask("9?99");

    //Anexo 2
    $("#anx2-3").mask("9?9999999999");
    $("#anx2-4").mask("9?9999999999");
    $("#anx2-5").mask("9?9999999999");
    $("#anx2-6").mask("9?9999999999");
    $("#anx2-7").mask("9?9999999999");
    $("#anx2-8").mask("9?9999999999");
    $("#anx2-9").mask("9?9999999999");
    $("#anx2-10").mask("9?9999999999");

    //Máscaras do Bloco 4
    $("#q27").mask("99:99");

    //Máscaras do Bloco 5
    $("#q33-1").mask("9?99");
    $("#q33-2").mask("9?99");
    $("#q33-3").mask("9?99");
    $("#q33-4").mask("9?99");
    $("#q33-5").mask("9?99");
    $("#q33-6").mask("9?99");
    $("#q33-7").mask("9?99");
    $("#q33-8").mask("9?99");
    $("#q33-9qtd").mask("9?99");
    $("#q33-10qtd").mask("9?99");
    $("#q33-11qtd").mask("9?99");

    //Máscaras do Bloco 8
    $("#q41").mask("99?99");
    $("#q42_inicio").mask("99:99");
    $("#q42_encerramento").mask("99:99");
    $("#q43_tempo_atividade_anos").mask("9?99");
    $("#q43_tempo_atividade_meses").mask("9?99");


    //Função do clique nas abas
    $('#myTab a').click(function(e) {
        if (!$("#2-data_levantamento").val()) {
            $("#alertaErro").html("O campo 'Data do Levantamento' (Bloco 1) é obrigatório.");
            $("#alertaErro").show("slow");
            setTimeout(function() {
                fechaAlerta("alertaErro");
            }, 3000);

            $("#2-data_levantamento").focus();

        } else {
            e.preventDefault();
            salvaDados();
            $(this).tab('show');

            if ($(this).attr('href') == '#grte-9') {
                $("#salvar9").show();
            } else {
                $("#salvar9").hide();
            }

        }
    });

    $('#salvar9').click(function(e) {
        salvaDados();
        $('body,html').animate({scrollTop: 0}, 600);
    });

    //Função do clique ir para o topo
    $('#irParaOTopo').click(function(e) {
        $('body,html').animate({scrollTop: 0}, 600);
    });

    //Botões do anexo 1

    $('#preencherAnexo1').click(function(e) {
        $("#camposAnexo1").show("slow");
    });

    $('#preencherAnexo2').click(function(e) {
        $("#camposAnexo2").show("slow");
    });


    $('#salvarAnexo1').click(function(e) {

        var formAnexoUm = "";

        formAnexoUm = "nome=" + $("#anx1-1").val();

        if ($("#anx1-2").is(":checked")) {
            formAnexoUm += "&area_sd=s";
        } else {
            formAnexoUm += "&area_sd=";
        }

        if ($("#anx1-3").is(":checked")) {
            formAnexoUm += "&area_ctps=s";
        } else {
            formAnexoUm += "&area_ctps=";
        }

        if ($("#anx1-4").is(":checked")) {
            formAnexoUm += "&area_capt_ativa=s";
        } else {
            formAnexoUm += "&area_capt_ativa=";
        }


        if ($("#anx1-5").is(":checked")) {
            formAnexoUm += "&area_rec_adm=s";
        } else {
            formAnexoUm += "&area_rec_adm=";
        }

        formAnexoUm += "&idade=" + $("#anx1-6").val();
        formAnexoUm += "&escolaridade=" + $("#anx1-7").val();
        formAnexoUm += "&regime_contratacao=" + $("#anx1-8").val();
        formAnexoUm += "&tempo_trabalho=" + $("#anx1-9").val();
        formAnexoUm += "&curso_curta_duracao=" + $("#anx1-10").val();
        formAnexoUm += "&curso_longa_duracao=" + $("#anx1-11").val();
        formAnexoUm += "&id_questionario_grte=" + $("#idQuestionarioGrte").val();
        formAnexoUm += "&id_questionario_grte_anx01=" + $("#id_questionario_grte_anx01").val();

        $.ajax({
            url: '/questionario-grte/ajax-salvar-anexo-um',
            async: false,
            type: 'POST',
            data: formAnexoUm,
            dataType: 'json',
            success: function(retorno) {

                if (retorno['type'] == 'success') {

                    $("#alertaSucesso").html(retorno['msn']);
                    $("#alertaSucesso").show("slow");
                    setTimeout(function() {
                        fechaAlerta("alertaSucesso");
                    }, 3000);

                    $('#desistirAnexo1').trigger("click");
                    $('#gridContainerAnexo1').loadGrid('questionario-grte/grid-anexo-um-grte', $('#idQuestionarioGrte'), 1);

                } else {

                    $("#alertaErro").html(retorno['msn']);
                    $("#alertaErro").show("slow");
                    setTimeout(function() {
                        fechaAlerta("alertaErro");
                    }, 3000);

                }

            }
        });
    });

    $('#desistirAnexo1').click(function(e) {

        $("#camposAnexo1 [name='nome']").val("");
        $("#camposAnexo1 [name='idade']").val("");
        $("#camposAnexo1 [name='regime_contratacao']").val("");
        $("#camposAnexo1 [name='escolaridade']").val("");
        $("#camposAnexo1 [name='tempo_trabalho']").val("");
        $("#camposAnexo1 [name='curso_curta_duracao']").val("");
        $("#camposAnexo1 [name='curso_longa_duracao']").val("");

        $("#camposAnexo1 [name='area_sd']").prop("checked", false);
        $("#camposAnexo1 [name='area_ctps']").prop("checked", false);
        $("#camposAnexo1 [name='area_capt_ativa']").prop("checked", false);
        $("#camposAnexo1 [name='area_rec_adm']").prop("checked", false);

        $("#camposAnexo1").hide("slow");

    });

    $('#salvarAnexo2').click(function(e) {

        var formAnexoDois = "";

        formAnexoDois = "codigo_meta=" + $("#anx2-2").val();

        if ($("#anx2-3-sim").is(":checked")) {
            formAnexoDois += "&utiliza=s";
        }

        if ($("#anx2-3-nao").is(":checked")) {
            formAnexoDois += "&utiliza=n";
        }

        formAnexoDois += "&prevista_1=" + $("#anx2-3").val();
        formAnexoDois += "&atingida_1=" + $("#anx2-4").val();
        formAnexoDois += "&prevista_2=" + $("#anx2-5").val();
        formAnexoDois += "&atingida_2=" + $("#anx2-6").val();
        formAnexoDois += "&prevista_3=" + $("#anx2-7").val();
        formAnexoDois += "&atingida_3=" + $("#anx2-8").val();
        formAnexoDois += "&meta_anual_prevista=" + $("#anx2-9").val();
        formAnexoDois += "&meta_anual_atingida=" + $("#anx2-10").val();
        formAnexoDois += "&id_questionario_grte=" + $("#idQuestionarioGrte").val();
        formAnexoDois += "&id_questionario_grte_anx02=" + $("#id_questionario_grte_anx02").val();

        $.ajax({
            url: '/questionario-grte/ajax-salvar-anexo-dois',
            async: false,
            type: 'POST',
            data: formAnexoDois,
            dataType: 'json',
            success: function(retorno) {

                if (retorno['type'] == 'success') {

                    $("#alertaSucesso").html(retorno['msn']);
                    $("#alertaSucesso").show("slow");
                    setTimeout(function() {
                        fechaAlerta("alertaSucesso");
                    }, 3000);

                    $('#desistirAnexo2').trigger("click");
                    $('#gridContainerAnexo2').loadGrid('questionario-grte/grid-anexo-dois-grte', $('#idQuestionarioGrte'), 1);

                } else {

                    $("#alertaErro").html(retorno['msn']);
                    $("#alertaErro").show("slow");
                    setTimeout(function() {
                        fechaAlerta("alertaErro");
                    }, 3000);

                }

            }
        });
    });

    $('#desistirAnexo2').click(function(e) {

        $("#camposAnexo2 [name='codigo_meta']").val("");
        $("#camposAnexo2 [name='prevista_1']").val("");
        $("#camposAnexo2 [name='atingida_1']").val("");
        $("#camposAnexo2 [name='prevista_2']").val("");
        $("#camposAnexo2 [name='atingida_2']").val("");
        $("#camposAnexo2 [name='prevista_3']").val("");
        $("#camposAnexo2 [name='atingida_3']").val("");
        $("#camposAnexo2 [name='meta_anual_prevista']").val("");
        $("#camposAnexo2 [name='meta_anual_atingida']").val("");

        $("#camposAnexo2 [name='anx_2-3']").prop("checked", false);

        $("#camposAnexo2").hide("slow");

    });


    //Controle de campos

    //Bloco 2

    $("#q15-7").click(function(e) {
        if ($("#q15-7").is(":checked")) {
            $("#q15-7-outras-div").show('slow');
        } else {
            $("#q15-7-outras-div").hide('slow');
            $("#q15-7-outras textarea").val("");
        }
    });

    //Bloco 3

    $("#q16-nao").click(function(e) {
        $("#q16-descrever-div").show('slow');
        $("#q16-sim").prop("checked", false);
    });

    $("#q16-sim").click(function(e) {
        $("#q16-descrever").val("");
        $("#q16-descrever-div").hide("slow");
        $("#q16-nao").prop("checked", false);
    });

    $("#q17-nao").click(function(e) {
        $("#q17-descrever-div").show('slow');
        $("#q17-sim").prop("checked", false);
    });

    $("#q17-sim").click(function(e) {
        $("#q17-descrever").val("");
        $("#q17-descrever-div").hide("slow");
        $("#q17-nao").prop("checked", false);
    });

    $("#q20-nao").click(function(e) {
        $("#q20-descrever").val("");
        $("#q20-descrever-div").hide("slow");
        $("#q20-sim").prop("checked", false);
    });

    $("#q20-sim").click(function(e) {
        $("#q20-descrever-div").show('slow');
        $("#q20-nao").prop("checked", false);
    });


    $("#q21-nao").click(function(e) {
        $("#q21-descrever").val("");
        $("#q21-descrever-div").hide("slow");
        $("#q21-sim").prop("checked", false);
    });

    $("#q21-sim").click(function(e) {
        $("#q21-descrever-div").show('slow');
        $("#q21-nao").prop("checked", false);
    });

    $("#q24-nao").click(function(e) {
        $("#q24-descrever-div").show('slow');
        $("#q24-sim").prop("checked", false);
    });

    $("#q24-sim").click(function(e) {
        $("#q24-descrever").val("");
        $("#q24-descrever-div").hide("slow");
        $("#q24-nao").prop("checked", false);
    });

    $("#q25-nao").click(function(e) {
        $("#q25-descrever-div").show('slow');
        $("#q25-sim").prop("checked", false);
    });

    $("#q25-sim").click(function(e) {
        $("#q25-descrever").val("");
        $("#q25-descrever-div").hide("slow");
        $("#q25-nao").prop("checked", false);
    });


    //Bloco 4

    $("#q26-6").click(function(e) {

        if ($("#q26-6").is(":checked")) {
            $("#q26-outras-div").show('slow');
        } else {
            $("#q26-outras-div").hide('slow');
            $("#q26-outras").val("");
        }

    });

    $("#q28-nao").click(function(e) {
        $("#q28-descrever").val("");
        $("#q28-descrever-div").hide("slow");
        $("#q28-sim").prop("checked", false);
    });

    $("#q28-sim").click(function(e) {
        $("#q28-descrever-div").show('slow');
        $("#q28-nao").propprop("checked", false);
    });

    //Bloco 5

    $("#q29-5").click(function(e) {

        if ($("#q29-5").is(":checked")) {
            $("#q29-outro-div").show('slow');
        } else {
            $("#q29-outro-div").hide('slow');
            $("#q29-outro").val("");
        }

    });

    $("#q30-nao").click(function(e) {
        $("#q30-descrever-div").show('slow');
    });

    $("#q30-em-parte").click(function(e) {
        $("#q30-descrever-div").show('slow');
    });


    $("#q30-sim").click(function(e) {
        $("#q30-descrever").val("");
        $("#q30-descrever-div").hide("slow");
    });

    $("#q31-nao").click(function(e) {
        $("#q31-descrever-div").show('slow');
    });

    $("#q31-em-parte").click(function(e) {
        $("#q31-descrever-div").show('slow');
    });


    $("#q31-sim").click(function(e) {
        $("#q31-descrever").val("");
        $("#q31-descrever-div").hide("slow");
    });


    $("#q32-nao").click(function(e) {
        $("#q32-descrever-div").show('slow');
    });

    $("#q32-em-parte").click(function(e) {
        $("#q32-descrever-div").show('slow');
    });


    $("#q34-sim").click(function(e) {
        $("#q34-descrever").val("");
        $("#q34-descrever-div").hide("slow");
    });

    $("#q34-nao").click(function(e) {
        $("#q34-descrever-div").show('slow');
    });

    $("#q34-em-parte").click(function(e) {
        $("#q34-descrever-div").show('slow');
    });

    $("#q34-sim").click(function(e) {
        $("#q34-descrever").val("");
        $("#q34-descrever-div").hide("slow");
    });

    $("#q35-nao").click(function(e) {
        $("#q35-descrever-div").show('slow');
    });

    $("#q35-em-parte").click(function(e) {
        $("#q35-descrever-div").show('slow');
    });


    $("#q35-sim").click(function(e) {
        $("#q35-descrever").val("");
        $("#q35-descrever-div").hide("slow");
    });

    $("#q36-nao").click(function(e) {
        $("#q37-div").hide('slow');
        $("#q37").val('');
        $("#q38").val('');
        $("#q39").val('');
    });


    //Verificando se é uma edição para popular os campos

    if ($("#idQuestionarioGrte").val()) {

        $.ajax({
            url: '/questionario-grte/ajax-carregar-grte',
            async: false,
            type: 'POST',
            data: 'id_questionario_grte=' + $("#idQuestionarioGrte").val(),
            dataType: 'json',
            success: function(retorno) {

                $("#bloco1").populate(retorno.bloco1);
                $("#bloco2").populate(retorno.bloco2);
                $("#bloco3").populate(retorno.bloco3);
                $("#bloco4").populate(retorno.bloco4);
                $("#bloco5").populate(retorno.bloco5);
                $("#bloco6").populate(retorno.bloco6);
                $("#bloco7").populate(retorno.bloco7);
                $("#bloco8").populate(retorno.bloco8);
                $("#bloco9").populate(retorno.bloco9);

                //Verificando o preenchimento dos campos para as ações cabíveis

                if ($("#q15-7").is(":checked")) {
                    $("#q15-7-outras-div").show('slow');
                }

                //Bloco 3

                if ($("#q16-nao").is(":checked")) {
                    $("#q16-descrever-div").show('slow');
                }

                if ($("#q17-nao").is(":checked")) {
                    $("#q17-descrever-div").show('slow');
                }

                if ($("#q20-sim").is(":checked")) {
                    $("#q20-descrever-div").show('slow');
                }

                if ($("#q21-sim").is(":checked")) {
                    $("#q21-descrever-div").show('slow');
                }

                if ($("#q24-nao").is(":checked")) {
                    $("#q24-descrever-div").show('slow');
                }

                if ($("#q25-nao").is(":checked")) {
                    $("#q25-descrever-div").show('slow');
                }

                //Bloco 4

                if ($("#q26-6").is(":checked")) {
                    $("#q26-outras-div").show('slow');
                }

                if ($("#q28-sim").is(":checked")) {
                    $("#q28-descrever-div").show('slow');
                }


                //Bloco 5

                if ($("#q29-5").is(":checked")) {
                    $("#q29-outro-div").show('slow');
                }

                if ($("#q30-nao").is(":checked")) {
                    $("#q30-descrever-div").show('slow');
                }

                if ($("#q30-em-parte").is(":checked")) {
                    $("#q30-descrever-div").show('slow');
                }

                if ($("#q31-nao").is(":checked")) {
                    $("#q31-descrever-div").show('slow');
                }

                if ($("#q31-em-parte").is(":checked")) {
                    $("#q31-descrever-div").show('slow');
                }

                if ($("#q32-nao").is(":checked")) {
                    $("#q32-descrever-div").show('slow');
                }

                if ($("#q32-em-parte").is(":checked")) {
                    $("#q32-descrever-div").show('slow');
                }

                if ($("#q34-nao").is(":checked")) {
                    $("#q34-descrever-div").show('slow');
                }

                if ($("#q34-em-parte").is(":checked")) {
                    $("#q34-descrever-div").show('slow');
                }

                if ($("#q35-nao").is(":checked")) {
                    $("#q34-descrever-div").show('slow');
                }

                if ($("#q35-em-parte").is(":checked")) {
                    $("#q34-descrever-div").show('slow');
                }

            }
        });

    }

});

function salvaDados() {

    $.ajax({
        url: '/questionario-grte/ajax-salvar-grte',
        async: false,
        type: 'POST',
        data: $('#bloco1').serialize() + "&" + $('#bloco2').serialize() + "&" + $('#bloco3').serialize() + "&" + $('#bloco4').serialize() + "&" + $('#bloco5').serialize() + "&" + $('#bloco6').serialize() + "&" + $('#bloco7').serialize() + "&" + $('#bloco8').serialize() + "&" + $('#bloco9').serialize(),
        dataType: 'json',
        success: function(retorno) {

            if (retorno['type'] == 'success') {

                $("#idQuestionarioGrte").val(retorno['id_questionario_grte']);

                $("#alertaSucesso").html(retorno['msn']);
                $("#alertaSucesso").show("slow");
                setTimeout(function() {
                    fechaAlerta("alertaSucesso");
                }, 3000);

            } else {

                $("#alertaErro").html(retorno['msn']);
                $("#alertaErro").show("slow");
                setTimeout(function() {
                    fechaAlerta("alertaErro");
                }, 3000);

            }

        }
    });

}

function fechaAlerta(idAlerta) {
    $("#" + idAlerta).hide("slow");
}

function onClickGridAnexo1(idQuestionarioGrteAnexo1) {

    $("#id_questionario_grte_anx01").val(idQuestionarioGrteAnexo1);

    $.ajax({
        url: '/questionario-grte/ajax-carregar-anexo-um',
        async: false,
        type: 'POST',
        data: 'id_questionario_grte_anx01=' + $("#id_questionario_grte_anx01").val(),
        dataType: 'json',
        success: function(retorno) {

            if (retorno) {

                $("#camposAnexo1 [name='nome']").val(retorno['nome']);
                $("#camposAnexo1 [name='idade']").val(retorno['idade']);
                $("#camposAnexo1 [name='regime_contratacao']").val(retorno['regime_contratacao']);
                $("#camposAnexo1 [name='escolaridade']").val(retorno['escolaridade']);
                $("#camposAnexo1 [name='tempo_trabalho']").val(retorno['tempo_trabalho']);
                $("#camposAnexo1 [name='curso_curta_duracao']").val(retorno['curso_curta_duracao']);
                $("#camposAnexo1 [name='curso_longa_duracao']").val(retorno['curso_longa_duracao']);

                if (retorno['area_sd'] == 's') {
                    $("#camposAnexo1 [name='area_sd']").prop("checked", true);
                }

                if (retorno['area_ctps'] == 's') {
                    $("#camposAnexo1 [name='area_ctps']").prop("checked", true);
                }

                if (retorno['area_capt_ativa'] == 's') {
                    $("#camposAnexo1 [name='area_capt_ativa']").prop("checked", true);
                }

                if (retorno['area_rec_adm'] == 's') {
                    $("#camposAnexo1 [name='area_rec_adm']").prop("checked", true);
                }

                $("#camposAnexo1").show("slow");


            } else {

                $("#id_questionario_grte_anx01").val("");
                $("#alertaErro").html("O anexo um não pôde ser carregado.");
                $("#alertaErro").show("slow");
                setTimeout(function() {
                    fechaAlerta("alertaErro");
                }, 3000);

                $('body,html').animate({scrollTop: 0}, 600);

            }

        }
    });

}

function deleteGridAnexo1(idQuestionarioGrteAnexo1) {

    showConfirmDialog('Deseja realmente excluir este anexo?',
            function() {
                $.ajax({
                    url: '/questionario-grte/ajax-delete-grte-anexo-um',
                    async: false,
                    type: 'POST',
                    data: 'id_questionario_grte_anx01=' + idQuestionarioGrteAnexo1,
                    dataType: 'json',
                    success: function(retorno) {

                        if (retorno['type'] == 'success') {

                            $("#alertaSucesso").html(retorno['msn']);
                            $("#alertaSucesso").show("slow");
                            setTimeout(function() {
                                fechaAlerta("alertaSucesso");
                            }, 3000);
                            $('#gridContainerAnexo1').loadGrid('questionario-grte/grid-anexo-um-grte', $('#idQuestionarioGrte'), 1);

                        } else {

                            $("#alertaErro").html(retorno['msn']);
                            $("#alertaErro").show("slow");
                            setTimeout(function() {
                                fechaAlerta("alertaErro");
                            }, 3000);

                        }

                    }
                });

            });

}

function onClickGridAnexo2(idQuestionarioGrteAnexo2) {

    $("#id_questionario_grte_anx02").val(idQuestionarioGrteAnexo2);

    $.ajax({
        url: '/questionario-grte/ajax-carregar-anexo-dois',
        async: false,
        type: 'POST',
        data: 'id_questionario_grte_anx02=' + $("#id_questionario_grte_anx02").val(),
        dataType: 'json',
        success: function(retorno) {

            if (retorno) {

                $("#camposAnexo2 [name='codigo_meta']").val(retorno['codigo_meta']);
                $("#camposAnexo2 [name='anx2-3']").val(retorno['utiliza']);
                $("#camposAnexo2 [name='prevista_1']").val(retorno['prevista_1']);
                $("#camposAnexo2 [name='atingida_1']").val(retorno['atingida_1']);
                $("#camposAnexo2 [name='prevista_2']").val(retorno['prevista_2']);
                $("#camposAnexo2 [name='atingida_2']").val(retorno['atingida_2']);
                $("#camposAnexo2 [name='prevista_3']").val(retorno['prevista_3']);
                $("#camposAnexo2 [name='atingida_3']").val(retorno['atingida_3']);
                $("#camposAnexo2 [name='meta_anual_prevista']").val(retorno['meta_anual_prevista']);
                $("#camposAnexo2 [name='meta_anual_atingida']").val(retorno['meta_anual_atingida']);


                if (retorno['utiliza'] == 's') {
                    $("#camposAnexo1 [name='anx2-3']").prop("checked", true);
                }

                $("#camposAnexo2").show("slow");

            } else {

                $("#id_questionario_grte_anx02").val("");
                $("#alertaErro").html("O anexo um não pôde ser carregado.");
                $("#alertaErro").show("slow");
                setTimeout(function() {
                    fechaAlerta("alertaErro");
                }, 3000);

                $('body,html').animate({scrollTop: 0}, 600);

            }

        }
    });

}

function deleteGridAnexo2(idQuestionarioGrteAnexo2) {

    showConfirmDialog('Deseja realmente excluir este anexo?',
            function() {
                $.ajax({
                    url: '/questionario-grte/ajax-delete-grte-anexo-dois',
                    async: false,
                    type: 'POST',
                    data: 'id_questionario_grte_anx02=' + idQuestionarioGrteAnexo2,
                    dataType: 'json',
                    success: function(retorno) {

                        if (retorno['type'] == 'success') {

                            $("#alertaSucesso").html(retorno['msn']);
                            $("#alertaSucesso").show("slow");
                            setTimeout(function() {
                                fechaAlerta("alertaSucesso");
                            }, 3000);
                            $('#gridContainerAnexo2').loadGrid('questionario-grte/grid-anexo-dois-grte', $('#idQuestionarioGrte'), 1);

                        } else {

                            $("#alertaErro").html(retorno['msn']);
                            $("#alertaErro").show("slow");
                            setTimeout(function() {
                                fechaAlerta("alertaErro");
                            }, 3000);

                        }

                    }
                });

            });

}