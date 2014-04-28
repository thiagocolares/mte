$(document).ready(function() {

    //Carregando a grid caso tenha algum valor no campo codigo_sine
    if ($("#codigo_sine").val()) {
        $('#gridContainer1').loadGrid('questionario-sine/grid-sine', $('#codigo_sine'), 1);
        $("#novoQuestionario").show("slow");
    }

    $('#confirmaCodigoSine').click(function(e) {

        if (!validaForm()) {
            $("#alertaErro").html("Campo 'Código SINE' obrigatório!");
            $("#alertaErro").show("slow");
            setTimeout(function() {
                fechaAlerta("alertaErro");
            }, 3000);

        } else {

            $.ajax({
                url: '/questionario-sine/ajax-verifica-codigo-sine',
                async: false,
                type: 'POST',
                data: "codigo_sine=" + $('#codigo_sine').val(),
                dataType: 'json',
                success: function(retorno) {

                    if (retorno) {
                        $('#gridContainer1').loadGrid('questionario-sine/grid-sine', $('#codigo_sine'), 1);
                        $("#novoQuestionario").show("slow");
                    } else {
                        $("#alertaErro").html("SINE não localizado.");
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

        if ($("#codigo_sine").val() == '') {
            $("#alertaErro").html("Campo 'Código da SINE' obrigatório.");
            $("#alertaErro").show("slow");
            setTimeout(function() {
                fechaAlerta("alertaErro");
            }, 3000);
        } else {
            $("#id_questionario_sine").val('');
            $("#formSine").submit();
        }
    });

});

function validaForm() {
    if ($("#codigo_sine").val() == "") {
        return false;
    } else {
        return true;
    }
}

function onClickGrid(idQuestionarioSine) {
    $("#id_questionario_sine").val(idQuestionarioSine);
    $("#formSine").submit();
}

function deleteGrid(idQuestionarioSine) {

    showConfirmDialog('Deseja realmente excluir este questionário?',
            function() {
                $.ajax({
                    url: '/questionario-sine/ajax-delete-sine',
                    async: false,
                    type: 'POST',
                    data: 'id_questionario_sine=' + idQuestionarioSine,
                    dataType: 'json',
                    success: function(retorno) {

                        if (retorno['type'] == 'success') {

                            $("#alertaSucesso").html(retorno['msn']);
                            $("#alertaSucesso").show("slow");
                            setTimeout(function() {
                                fechaAlerta("alertaSucesso");
                            }, 3000);
                            $('#gridContainer1').loadGrid('questionario-sine/grid-sine', $('#codigo_sine'), 1);

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