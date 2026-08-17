/**
 * AI Assistant Persona CRUD
 *
 * JavaScript topics used here:
 * - AngularJS module + controller (MVC)
 * - Two-way data binding (ng-model)
 * - Arrays: map, filter, findIndex
 * - Objects and spread-style copies
 * - localStorage for persistence
 * - JSON.parse / JSON.stringify
 */

(function () {
  "use strict";

  var STORAGE_KEY = "ai-assistant-personas";

  var SAMPLE_PERSONAS = [
    {
      id: "p-1",
      name: "Code Mentor",
      role: "Programming tutor",
      tone: "Friendly",
      description: "Helps beginners learn JavaScript with small examples.",
      systemPrompt:
        "You are a patient coding tutor. Explain concepts in simple language and show short code snippets.",
      color: "#4f46e5",
    },
    {
      id: "p-2",
      name: "Support Desk",
      role: "Customer support agent",
      tone: "Professional",
      description: "Answers product questions clearly and politely.",
      systemPrompt:
        "You are a professional support agent. Be concise, accurate, and empathetic.",
      color: "#0f766e",
    },
  ];

  var COLORS = ["#4f46e5", "#0f766e", "#b45309", "#be123c", "#0369a1", "#7c3aed"];

  angular.module("personaApp", []).controller("PersonaController", PersonaController);

  function PersonaController() {
    var vm = this;

    vm.personas = loadPersonas();
    vm.selected = vm.personas[0] || null;
    vm.searchText = "";
    vm.formOpen = false;
    vm.form = emptyForm();

    vm.filteredCount = filteredCount;
    vm.select = select;
    vm.openForm = openForm;
    vm.closeForm = closeForm;
    vm.save = save;
    vm.remove = remove;

    function filteredCount() {
      var query = (vm.searchText || "").toLowerCase();
      if (!query) {
        return vm.personas.length;
      }
      return vm.personas.filter(function (persona) {
        return (
          persona.name.toLowerCase().indexOf(query) !== -1 ||
          persona.role.toLowerCase().indexOf(query) !== -1 ||
          persona.tone.toLowerCase().indexOf(query) !== -1
        );
      }).length;
    }

    function select(persona) {
      vm.selected = persona;
    }

    function openForm(persona) {
      vm.form = persona ? angular.copy(persona) : emptyForm();
      vm.formOpen = true;
    }

    function closeForm() {
      vm.formOpen = false;
      vm.form = emptyForm();
    }

    function save() {
      if (vm.form.id) {
        updatePersona();
      } else {
        createPersona();
      }
      persist();
      closeForm();
    }

    function createPersona() {
      var persona = {
        id: "p-" + Date.now(),
        name: vm.form.name.trim(),
        role: vm.form.role.trim(),
        tone: vm.form.tone,
        description: vm.form.description.trim(),
        systemPrompt: vm.form.systemPrompt.trim(),
        color: COLORS[vm.personas.length % COLORS.length],
      };
      vm.personas.push(persona);
      vm.selected = persona;
    }

    function updatePersona() {
      var index = vm.personas.findIndex(function (persona) {
        return persona.id === vm.form.id;
      });
      if (index === -1) {
        return;
      }
      vm.personas[index] = angular.copy(vm.form);
      vm.selected = vm.personas[index];
    }

    function remove(persona) {
      if (!window.confirm('Delete persona "' + persona.name + '"?')) {
        return;
      }
      vm.personas = vm.personas.filter(function (item) {
        return item.id !== persona.id;
      });
      if (vm.selected && vm.selected.id === persona.id) {
        vm.selected = vm.personas[0] || null;
      }
      persist();
    }

    function emptyForm() {
      return {
        id: null,
        name: "",
        role: "",
        tone: "Friendly",
        description: "",
        systemPrompt: "",
      };
    }

    function loadPersonas() {
      try {
        var raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) {
          return SAMPLE_PERSONAS.slice();
        }
        var parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : SAMPLE_PERSONAS.slice();
      } catch (error) {
        return SAMPLE_PERSONAS.slice();
      }
    }

    function persist() {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(vm.personas));
    }
  }
})();
