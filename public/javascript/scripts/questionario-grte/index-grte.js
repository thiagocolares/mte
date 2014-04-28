$(document).ready(function() {

    //Carregando a grid caso tenha algum valor no campo codigo_grte
    if ($("#codigo_grte").val()) {
        $('#gridContainer1').loadGrid('questionario-grte/grid-grte', $('#codigo_grte'), 1);
        $("#novoQuestionario").show("slow");
    }

    $('#confirmaCodigoGrte').click(function(e) {

        if (!validaForm()) {
            $("#alertaErro").html("Campo 'Código GRTE' obrigatório!");
            $("#alertaErro").show("slow");
            setTimeout(function() {
                fechaAlerta("alertaErro");
            }, 3000);

        } else {

            $.ajax({
                url: '/questionario-grte/ajax-verifica-codigo-grte',
                async: false,
                type: 'POST',
                data: "codigo_grte=" + $('#codigo_grte').val(),
                dataType: 'json',
                success: function(retorno) {

                    if (retorno) {
                        $('#gridContainer1').loadGrid('questionario-grte/grid-grte', $('#codigo_grte'), 1);
                        $("#novoQuestionario").show("slow");
                    } else {
                        $("#alertaErro").html("GRTE não localizado.");
                        $("#alertaErro").show("slow");
                        setTimeout(function() {
                            fechaAlerta("alertaErro");
                        }, 3000);
                    }
                }
            });

        }

    });

    $("#novoQuestionario").click(function(e) {

        if ($("#codigo_grte").val() == '') {
            $("#alertaErro").html("Campo 'Código da GRTE' obrigatório.");
            $("#alertaErro").show("slow");
            setTimeout(function() {
                fechaAlerta("alertaErro");
            }, 3000);
        } else {
            $("#id_questionario_grte").val('');
            $("#formGrte").submit();
        }
    });

});

function validaForm() {
    if ($("#codigo_grte").val() == "") {
        return false;
    } else {
        return true;
    }
}

function onClickGrid(idQuestionarioGrte) {
    $("#id_questionario_grte").val(idQuestionarioGrte);
    $("#formGrte").submit();
}

function deleteGrid(idQuestionarioGrte) {

    showConfirmDialog('Deseja realmente excluir este questionário?',
            function() {
                $.ajax({
                    url: '/questionario-grte/ajax-delete-grte',
                    async: false,
                    type: 'POST',
                    data: 'id_questionario_grte=' + idQuestionarioGrte,
                    dataType: 'json',
                    success: function(retorno) {

                        if (retorno['type'] == 'success') {

                            $("#alertaSucesso").html(retorno['msn']);
                            $("#alertaSucesso").show("slow");
                            setTimeout(function() {
                                fechaAlerta("alertaSucesso");
                            }, 3000);
                            $('#gridContainer1').loadGrid('questionario-grte/grid-grte', $('#codigo_grte'), 1);

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

function fechaAlerta(idAlerta) {
    $("#" + idAlerta).hide("slow");
}