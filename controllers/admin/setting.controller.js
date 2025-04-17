const SettingGeneral = require("../../models/setting-general.model");

module.exports.general = async (req, res) => {
    const settingGeneral = await SettingGeneral.findOne({});

    res.render("admin/pages/settings/general", {
        title: "Cài đặt chung",
        settingGeneral: settingGeneral,
    });
}

module.exports.generalPost = async (req, res) => {
    const settingGeneral = await SettingGeneral.findOne({});

    if (settingGeneral) {
        await SettingGeneral.updateOne({ _id: settingGeneral._id }, req.body);
    } else {
        const record = new SettingGeneral(req.body);
        await record.save();
        
    }
    req.flash("success", "Cập nhật thành công"); 
    res.redirect("back");
}