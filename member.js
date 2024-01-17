function skillsMember() {
    var skills = ['html', 'css', 'js', 'php', 'mysql'];
    var member = {
        name: 'Nguyen Van A',
        age: 20,
        skills: skills,
        showInfo: function() {
            console.log('Name: ' + this.name);
            console.log('Age: ' + this.age);
            console.log('Skills: ' + this.skills.join(', '));
        }
    };
    return member;
}