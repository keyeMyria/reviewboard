var prevTypes = {},
    origRepoTypes = [],
    powerPackTemplate = [
        '<h3>', gettext('Power Pack Required'), '</h3>',
        '<p>',
        gettext('<span class="power-pack-advert-hosting-type"></span> support is available with <a href="https://www.reviewboard.org/powerpack/">Power Pack</a>, an extension which also offers powerful reports, document review, and more.'),
        '</p>'
    ].join('');

function updateFormDisplay(id, tools_info) {
    var type = $('#id_' + id).val(),
        oldInfo = tools_info[prevTypes[id]],
        newInfo = tools_info[type],
        text,
        field,
        i;

    for (i = 0; i < oldInfo.fields.length; i++) {
        $('#row-' + oldInfo.fields[i]).hide();
    }

    for (field in oldInfo.help_text) {
        $('#row-' + field).find('p.help')
            .remove();
    }

    for (i = 0; i < newInfo.fields.length; i++) {
        $('#row-' + newInfo.fields[i]).show();
    }

    for (field in newInfo.help_text) {
        if (newInfo.help_text.hasOwnProperty(field)) {
            text = newInfo.help_text[field];

            $('<p class="help"/>')
                .text(text)
                .appendTo($('#row-' + field));
        }
    }

    prevTypes[id] = type;
}

function updatePlanEl($row, $plan, serviceType) {
    var planTypes = HOSTING_SERVICES[serviceType].plans,
        selectedPlan = $plan.val(),
        planType,
        opt,
        i;

    $plan.empty();

    if (planTypes.length === 1) {
        $row.hide();
    } else {
        for (i = 0; i < planTypes.length; i++) {
            planType = planTypes[i];
            opt = $('<option/>')
                .val(planType.type)
                .text(planType.label)
                .appendTo($plan);

            if (planType.type === selectedPlan) {
                opt.prop('selected', true);
            }
        }

        $row.show();
    }

    $plan.triggerHandler('change');
}

function updateHostingForm($hostingType, formPrefix, $plan, $forms) {
    var formID = formPrefix + '-' + $hostingType.val() + '-' +
                 ($plan.val() || 'default');

    $forms.hide();
    $('#' + formID).show();
}

function hideAllToolsFields() {
    var fields = TOOLS_INFO.none.fields,
        i;

    for (i = 0; i < fields.length; i++) {
        $('#row-' + fields[i]).hide();
    }
}

function updateRepositoryType() {
    var hostingType = $('#id_hosting_type').val(),
        newRepoTypes = (hostingType === 'custom'
                        ? []
                        : HOSTING_SERVICES[hostingType].scmtools),
        $repoTypes = $('#id_tool'),
        currentRepoType = $repoTypes.val();

    $repoTypes.empty();

    $(origRepoTypes).each(function (i) {
        var repoType = origRepoTypes[i];

        if (newRepoTypes.length === 0 ||
            newRepoTypes.indexOf(repoType.text) !== -1) {
            $('<option/>')
                .text(repoType.text)
                .val(repoType.value)
                .appendTo($repoTypes);

            if (repoType.value === currentRepoType) {
                $repoTypes.val(currentRepoType);
            }
        }
    });

    $repoTypes.triggerHandler('change');
}

$(document).ready(function() {
    var $hostingType = $('#id_hosting_type'),
        $hostingURLRow = $('#row-hosting_url'),
        $hostingURL = $('#id_hosting_url'),
        $hostingAccount = $('#id_hosting_account'),
        $hostingAccountRow = $('#row-hosting_account'),
        $hostingAccountUserRow = $('#row-hosting_account_username'),
        $hostingAccountPassRow = $('#row-hosting_account_password'),
        $hostingAccountTwoFactorAuthCodeRow =
            $('#row-hosting_account_two_factor_auth_code'),
        $hostingAccountRelink = $('<p/>')
            .text(gettext('The authentication requirements for this account have changed. You will need to re-authenticate.'))
            .addClass('errornote')
            .hide()
            .appendTo($hostingAccountRow),
        $associateSshKeyFieldset =
            $('#row-associate_ssh_key').parents('fieldset'),
        $associateSshKey = $('#id_associate_ssh_key'),
        associateSshKeyDisabled = $associateSshKey.prop('disabled'),
        $bugTrackerUseHosting = $('#id_bug_tracker_use_hosting'),
        $bugTrackerType = $('#id_bug_tracker_type'),
        $bugTrackerHostingURLRow = $('#row-bug_tracker_hosting_url'),
        $bugTrackerTypeRow = $('#row-bug_tracker_type'),
        $bugTrackerPlan = $('#id_bug_tracker_plan'),
        $bugTrackerPlanRow = $('#row-bug_tracker_plan'),
        $bugTrackerURLRow = $('#row-bug_tracker'),
        $bugTrackerUsernameRow =
            $('#row-bug_tracker_hosting_account_username'),
        $repoPathRow = $('#row-path'),
        $repoMirrorPathRow = $('#row-mirror_path'),
        $repoPlanRow = $('#row-repository_plan'),
        $repoPlan = $('#id_repository_plan'),
        $publicAccess = $('#id_public'),
        $tool = $('#id_tool'),
        $toolRow = $('#row-tool'),
        $publicKeyPopup = $('#ssh-public-key-popup'),
        $repoForms = $('.repo-form'),
        $bugTrackerForms = $('.bug-tracker-form'),
        $submitButtons = $('input[type="submit"]'),
        $powerPackAdvert = $('<div class="powerpack-advert" />')
            .html(powerPackTemplate)
            .hide()
            .appendTo($hostingType.closest('fieldset'));

    prevTypes.bug_tracker_type = 'none';
    prevTypes.hosting_type = 'custom';
    prevTypes.tool = 'none';

    $tool.find('option').each(function() {
        var $repoType = $(this);

        origRepoTypes.push({
            value: $repoType.val(),
            text: $repoType.text()
        });
    });

    $bugTrackerUseHosting
        .change(function() {
            if (this.checked) {
                $bugTrackerTypeRow.hide();
                $bugTrackerPlanRow.hide();
                $bugTrackerUsernameRow.hide();
                $bugTrackerURLRow.hide();
                $bugTrackerForms.hide();
            } else {
                $bugTrackerTypeRow.show();
                $bugTrackerType.triggerHandler('change');
            }
        })
        .triggerHandler('change');

    $repoPlan.change(function() {
        updateHostingForm($hostingType, 'repo-form', $repoPlan, $repoForms);
    });

    $bugTrackerPlan.change(function() {
        var plan = $bugTrackerPlan.val() || 'default',
            bugTrackerType = $bugTrackerType.val(),
            planInfo = HOSTING_SERVICES[bugTrackerType].planInfo[plan];

        updateHostingForm($bugTrackerType, 'bug-tracker-form',
                          $bugTrackerPlan, $bugTrackerForms);

        $bugTrackerUsernameRow.setVisible(
            planInfo.bug_tracker_requires_username);
    });

    $hostingType
        .change(function() {
            var hostingType = $hostingType.val(),
                isCustom = (hostingType === 'custom'),
                isFake = (!isCustom &&
                          HOSTING_SERVICES[hostingType].fake === true);

            updateRepositoryType();

            if (isCustom) {
                $repoPlanRow.hide();
                $repoPathRow.show();
                $repoMirrorPathRow.show();
            } else {
                hideAllToolsFields();
                $repoPathRow.hide();
                $repoMirrorPathRow.hide();

                updatePlanEl($repoPlanRow, $repoPlan, hostingType);
            }

            $repoPlan.triggerHandler('change');

            if (isCustom ||
                !HOSTING_SERVICES[hostingType].supports_bug_trackers) {
                $bugTrackerUseHosting
                    .prop({
                        disabled: true,
                        checked: false
                    })
                    .triggerHandler('change');
            } else {
                $bugTrackerUseHosting.prop('disabled', false);
            }

            if (isCustom ||
                !HOSTING_SERVICES[hostingType].supports_ssh_key_association) {
                $associateSshKeyFieldset.hide();
                $associateSshKey.prop({
                    disabled: true,
                    checked: false
                });
            } else {
                /*
                 * Always use the original state of the checkbox (i.e. the
                 * state on page load)
                 */
                $associateSshKey.prop('disabled', associateSshKeyDisabled);
                $associateSshKeyFieldset.show();
            }

            $hostingURLRow.setVisible(
                !isCustom && HOSTING_SERVICES[hostingType].self_hosted);

            if (isFake) {
                $powerPackAdvert
                    .find('.power-pack-advert-hosting-type')
                    .text($hostingType.find(':selected').text());
            }

            $bugTrackerTypeRow.setVisible(!isFake);
            $repoPlanRow.setVisible(!isFake);
            $hostingAccountRow.setVisible(!isFake);
            $hostingAccountUserRow.setVisible(!isFake);
            $hostingAccountPassRow.setVisible(!isFake);
            $toolRow.setVisible(!isFake);

            $powerPackAdvert.setVisible(isFake);
            $submitButtons.prop('disabled', isFake);
        })
        .triggerHandler('change');

    $([$hostingType[0], $hostingURL[0]])
        .change(function() {
            var hostingType = $hostingType.val(),
                hostingInfo,
                accounts,
                foundSelected,
                selectedAccount,
                selectedURL,
                account,
                opt,
                i;

            if (hostingType !== 'custom') {
                hostingInfo = HOSTING_SERVICES[hostingType];
                accounts = hostingInfo.accounts;
                foundSelected = false;

                /* Rebuild the list of accounts. */
                selectedAccount = parseInt($hostingAccount.val(), 10);
                selectedURL = $hostingURL.val() || null;
                $hostingAccount.find('option[value!=""]').remove();

                if (hostingInfo.needs_two_factor_auth_code) {
                    /*
                     * The first one will be selected automatically, which
                     * we want. Don't select any below.
                     */
                    foundSelected = true;
                }

                for (i = 0; i < accounts.length; i++) {
                    account = accounts[i];

                    if (account.hosting_url === selectedURL) {
                        opt = $('<option/>')
                            .val(account.pk)
                            .text(account.username)
                            .data('account', account)
                            .appendTo($hostingAccount);

                        if (account.pk === selectedAccount || !foundSelected) {
                            opt.prop('selected', true);
                            foundSelected = true;
                            $hostingAccount.triggerHandler('change');
                        }
                    }
                }
            }
        });

    $([$hostingType[0], $hostingAccount[0]])
        .change(function() {
            var hostingType = $hostingType.val(),
                hostingInfo,
                selectedIndex,
                account,
                $selectedOption;

            $hostingAccountRelink.hide();
            $hostingAccountTwoFactorAuthCodeRow.hide();

            if (hostingType === 'custom') {
                $hostingAccountRow.hide();
                $hostingURLRow.hide();
                $hostingAccountUserRow.hide();
                $hostingAccountPassRow.hide();
            } else {
                hostingInfo = HOSTING_SERVICES[hostingType];

                if (hostingInfo.fake !== true) {
                    $hostingAccountRow.show();

                    if (hostingInfo.self_hosted) {
                        $hostingURLRow.show();
                    }

                    if ($hostingAccount.val() === '') {
                        $hostingAccountUserRow.show();

                        $hostingAccountPassRow.setVisible(
                            hostingInfo.needs_authorization);

                        if (hostingInfo.needs_two_factor_auth_code) {
                            $hostingAccountTwoFactorAuthCodeRow.show();
                        }
                    } else {
                        selectedIndex = $hostingAccount[0].selectedIndex;
                        $selectedOption = $($hostingAccount[0]
                            .options[selectedIndex]);
                        account = $selectedOption.data('account');

                        $hostingAccountUserRow.hide();

                        if (account.is_authorized) {
                            $hostingAccountPassRow.hide();
                        } else {
                            $hostingAccountPassRow.show();
                            $hostingAccountRelink.show();
                        }
                    }
                }
            }
        })
        .triggerHandler('change');

    $tool
        .change(function() {
            if ($hostingType.val() === 'custom') {
                updateFormDisplay('tool', TOOLS_INFO);
            } else {
                hideAllToolsFields();
            }
        })
        .triggerHandler('change');

    $bugTrackerType
        .change(function() {
            var bugTrackerType = $bugTrackerType.val();

            $bugTrackerForms.hide();

            if (bugTrackerType === 'custom' || bugTrackerType === 'none') {
                $bugTrackerHostingURLRow.hide();
                $bugTrackerPlanRow.hide();
                $bugTrackerUsernameRow.hide();
            }

            if (bugTrackerType === 'custom') {
                $bugTrackerURLRow.show();
            } else if (bugTrackerType === 'none') {
                $bugTrackerURLRow.hide();
            } else {
                $bugTrackerURLRow.hide();
                updatePlanEl($bugTrackerPlanRow, $bugTrackerPlan,
                             bugTrackerType);

                $bugTrackerHostingURLRow.setVisible(
                    HOSTING_SERVICES[bugTrackerType].self_hosted);
            }
        })
        .triggerHandler('change');

    $publicAccess
        .change(function() {
            var visible = !this.checked;
            $('#row-users').setVisible(visible);
            $('#row-review_groups').setVisible(visible);
        })
        .triggerHandler('change');

    $('#show-ssh-key-link').toggle(function() {
        $(this).text(gettext('Hide SSH Public Key'));
        $publicKeyPopup.show();
        return false;
    }, function() {
        $(this).text(gettext('Show SSH Public Key'));
        $publicKeyPopup.hide();
        return false;
    });


});
