import mongoose from 'mongoose';
import Password from '../services/password';

// Interface used to describe the attributes that the created message must have
interface MessageAttrs {
    messageText: string;
    messageAuthor: string;
}

// An interface that describes that properties
// that the User document has
interface MessageDoc extends mongoose.Document {
    messageText: string;
    messageAuthor: string;
};

// An interface that describes the properties
// that the User Model has
interface MessageModel extends mongoose.Model<MessageDoc> {
    build(attrs: MessageAttrs): MessageDoc;
};

const MessageSchema = new mongoose.Schema({
    messageText: {
        type: String,
        required: true
    },

    messageAuthor: {
        type: String,
        required: true
    }
})

MessageSchema.pre('save', async function(done) {
    if (this.isModified('message')) {
        const hashed = await Password.toHash(this.get('message'));
        this.set('message', hashed);
    }
    done();
});

MessageSchema.statics.build = (attrs: MessageAttrs) => {
    return new Message(attrs);
};

const Message = mongoose.model<MessageDoc, MessageModel>('User', MessageSchema);

export { Message };