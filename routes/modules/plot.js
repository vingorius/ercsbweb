var plot = {};
plot.newSample = function(id, name, group, gene_list) {
    return {
        id: "id",
        name: name,
        group: group,
        gene_list: gene_list
    };
};

plot.newGene = function(name, aberration_list) {
    return {
        name: name,
        aberration_list: aberration_list
    };
};

plot.newAberration = function(type, value) {
    return {
        type: type,

        value: value
    };
};

plot.getSample = function(sample_list,sample_name){
    var samples = sample_list.filter(function(obj) {
        return obj.name == sample_name;
    });
    return (samples.length === 0) ? undefined : samples[0];
};

plot.getGene = function(gene_list,gene_name){
    var genes = gene_list.filter(function(obj) {
        return obj.name == gene_name;
    });
    return (genes.length === 0) ? undefined : genes[0];
};

module.exports = plot;
