$(document).ready(function() {
    traerMultas()
    traerTiposMultas()

    $('#tabla-cuerpo').on('click', 'tr', function() {
        
        $('#boton-guardar').attr('disabled', true);
        $('#boton-nuevo').attr('disabled', false);
        $('#boton-modificacion').attr('disabled', false);
        $('#boton-borrar').attr('disabled', false);

        $('#id-multa').val($(this).find('td:eq(0)').text().trim());
        $('#motivo-multa').val($(this).find('td:eq(1)').text().trim()); 
        $('#monto-multa').val($(this).find('td:eq(2)').text().trim()); 
        $('#metodo-pago').val($(this).find('td:eq(3)').text().trim()); 
        $('#n-tarjeta').val($(this).find('td:eq(3)').attr('data-trj')); 
        $('#fecha-multa').val($(this).find('td:eq(4)').text().trim()); 
        $('#tipo-multa').val($(this).find('td:eq(5)').text().trim()); 
        $('#id-renta').val($(this).find('td:eq(6)').text().trim());
        
        deshabilitarCampos();
    });

    $('#boton-nuevo').click(function() {
        habilitarCampos()
        limpiarCampos() 
        $('#boton-guardar').attr('disabled', false);
        $('#boton-nuevo').attr('disabled', true);
        $('#boton-modificacion').attr('disabled', true);
        $('#boton-borrar').attr('disabled', true);
    });

    $('#boton-modificacion').click(function() {
        habilitarCampos()
        $('#boton-guardar').attr('disabled', false);
        $('#boton-nuevo').attr('disabled', false);
        $('#boton-modificacion').attr('disabled', true);
        $('#boton-borrar').attr('disabled', true);
    });

    $('#boton-guardar').click(function() {
        if ($("#id-multa").val() === "" ){
            option = "Guardar"
            typemod = 'POST'
            ID = null;
        } else {
            option = "Actualizar"
            typemod = 'PUT'
            ID = $("#id-multa").val();
        }
        var monto = $('#tipo-multa option:selected').attr('data-mnt');
        $.ajax({
            url: "https://localhost:7131/Multas/"+ option,
            type: typemod,
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data: JSON.stringify({
                "iD_multa": ID,
                "motivo": $("#motivo-multa").val(),
                "monto": monto,
                "metodo_pago": $('#metodo-pago').val(),
                "numero_tarjeta": $('#n-tarjeta').val(),
                "iD_tipo_multa": $('#tipo-multa').val(),
                "iD_renta": $('#id-renta').val(),
            }),
            crossDomain: true,
            success: function(response) {
                if (response.success === "True") {
                    console.log(response.message);
                    limpiarCampos()
                    deshabilitarCampos()
                    traerMultas()
                    alert("Guardado exitoso!");
                    $('#boton-guardar').attr('disabled', true);
                    $('#boton-nuevo').attr('disabled', false);
                    $('#boton-modificacion').attr('disabled', true);
                    $('#boton-borrar').attr('disabled', true);
                } else {
                    console.error(response.message);
                    alert("Hubo un problema al intentar guardar.");
                }
            },
            error: function(xhr, status, error) {
                console.error("Hubo un error en la solicitud:", error);
                alert("Hubo un problema al intentar guardar.");
            }
        })
    });

    // $('#boton-borrar').click(function() {
    //     $.ajax({
    //         url: "https://localhost:7131/Cargos/Borrar",
    //         type: 'DELETE',
    //         contentType: "application/json; charset=utf-8",
    //         dataType: 'json',
    //         data: JSON.stringify({
    //             "iD_cargo": $("#id-multa").val(),
    //         }),
    //         crossDomain: true,
    //         success: function(response) {
    //             if (response.success === "True") {
    //                 console.log(response.message);
    //                 limpiarCampos();
    //                 deshabilitarCampos();
    //                 traerMultas();
    //                 alert("Borrado exitoso!");
    //                 $('#boton-guardar').attr('disabled', true);
    //                 $('#boton-nuevo').attr('disabled', false);
    //                 $('#boton-modificacion').attr('disabled', true);
    //                 $('#boton-borrar').attr('disabled', true);
    //             } else {
    //                 console.error(response.message);
    //                 alert("Hubo un problema al intentar eliminar.");
    //             }
    //         },
    //         error: function(xhr, status, error) {
    //             console.error("Hubo un error en la solicitud:", error);
    //             alert("Hubo un problema al intentar eliminar.");
    //         }
    //     });
        
    // });
});

function limpiarCampos(){
    $('.fila-campos div textarea').val('');
    $('.fila-campos div select').val('default');
}

function deshabilitarCampos(){
    $('.fila-campos div textarea').attr('disabled', true);
    $('.fila-campos div select').attr('disabled', true);
}

function habilitarCampos(){
    $('#motivo-multa').attr('disabled', false); 
    $('#metodo-pago').attr('disabled', false); 
    $('#n-tarjeta').attr('disabled', false); 
    $('#tipo-multa').attr('disabled', false); 
    $('#id-renta').attr('disabled', false); 
}


function traerMultas() {
    $('#tabla-cuerpo').empty();
    $.ajax({
        url: "https://localhost:7131/Multas/Traer",
        type: 'GET',
        dataType: 'json',
        crossDomain: true
    }).done(function (result) {
        console.log(result.result.multa)
        result.result.multa.forEach(function(multa) {
            var ID_multa = multa.iD_multa;
            var motivo = multa.motivo;
            var monto = multa.monto
            var metodo_pago = multa.metodo_pago;
            var n_tarjeta = multa.numero_tarjeta;
            var fecha_multa = multa.fecha_multa.substring(0, 10);
            var ID_tipo_multa = multa.iD_tipo_multa;
            var ID_renta = multa.iD_renta;
            
            $('#tabla-cuerpo').append(`
                <tr>
                    <td>${ID_multa}</td>
                    <td>${motivo}</td>
                    <td>${monto}</td>
                    <td data-trj="${n_tarjeta}">${metodo_pago}</td>
                    <td>${fecha_multa}</td>
                    <td>${ID_tipo_multa}</td>
                    <td>${ID_renta}</td>
                </tr>
            `);    
        });
    }).fail(function (xhr, status, error) {
        alert("Hubo un problema al traer los cargos: " + error + "\nStatus: " + status);
        console.error(xhr);
    });
}

function traerTiposMultas() {
    $('#tabla-cuerpo').empty();
    $.ajax({
        url: "https://localhost:7131/TiposMulta/Traer",
        type: 'GET',
        dataType: 'json',
        crossDomain: true
    }).done(function (result) {
        console.log(result.result.tiposMulta)
        result.result.tiposMulta.forEach(function(TiposMulta) {
            var ID_tipo_multa = TiposMulta.iD_tipo_multa;
            var descripcion = TiposMulta.descripcion;
            var tarifa = TiposMulta.tarifa
            
            $('#tipo-multa').append(`
                <option value="${ID_tipo_multa}" data-mnt="${tarifa}">${descripcion}</option>
            `);    
        });
    }).fail(function (xhr, status, error) {
        alert("Hubo un problema al traer los paises: " + error + "\nStatus: " + status);
        console.error(xhr);
    });
}